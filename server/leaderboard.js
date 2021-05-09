const Elo = require('arpad');
const _ = require('lodash');
const Cursor = require('pg-cursor');
const moment = require('moment');
const { cleanUsername } = require('../privacy');

const setupRoutes = (app, dbPool) => {
    let leaderboardCache = null;
    let leaderboardPastCache = null;

    const buildLeaderboard = async () => {
        console.log('Build leaderboard');
        // intentionally obtuse code below
        const client = await dbPool.connect();

        const idResponse = await client.query(`
      SELECT
        id
      FROM
        games
      WHERE
        date > now() - interval '24 week'
      ORDER BY
        date DESC,
        id DESC
    `);
        const ids = _.map(idResponse.rows, 'id');

        let index = 0;
        const pageSize = 100;
        const download = async () => {
            const idGroup = ids.slice(index, Math.min(index + pageSize, ids.length));
            if (idGroup.length === 0) return [];
            const query = `
        SELECT
          id,
          winner,
          winner_deck_id,
          winner_deck_name,
          loser,
          loser_deck_id,
          loser_deck_name
        FROM
          games
        WHERE
          id IN (${idGroup.join(', ')});
      `;
            const response = await client.query(query);
            index += pageSize;
            return _.sortBy(response.rows, 'id');
        };

        const scoreGame = (game, deckMap, eloMap) => {
            const winnerID = `${game.winner}_${game.winner_deck_id}`;
            const loserID = `${game.loser}_${game.loser_deck_id}`;

            if (!deckMap.has(winnerID)) {
                deckMap.set(winnerID, {
                    player: cleanUsername(game.winner),
                    id: winnerID,
                    deckID: game.winner_deck_id,
                    gameIDs: [game.id],
                    name: game.winner_deck_name,
                    wins: 0,
                    losses: 0
                });
            }

            if (!deckMap.has(loserID)) {
                deckMap.set(loserID, {
                    player: cleanUsername(game.loser),
                    id: loserID,
                    deckID: game.loser_deck_id,
                    gameIDs: [game.id],
                    name: game.loser_deck_name,
                    wins: 0,
                    losses: 0
                });
            }

            const winner = deckMap.get(winnerID);
            winner.wins += 1;
            winner.gameIDs.push(game.id);

            const loser = deckMap.get(loserID);
            loser.losses += 1;
            loser.gameIDs.push(game.id);

            eloMap[winnerID] = eloMap[winnerID] || 1500;
            eloMap[loserID] = eloMap[loserID] || 1500;

            const eloA = eloMap[winnerID];
            const eloB = eloMap[loserID];

            if (winner.wins + winner.losses > 10) {
                const eloAOdds = elo.expectedScore(eloA, eloB);
                eloMap[winnerID] = elo.newRating(eloAOdds, 1.0, eloA);
            }

            if (loser.wins + loser.losses > 10) {
                const eloBOdds = elo.expectedScore(eloB, eloA);
                eloMap[loserID] = elo.newRating(eloBOdds, 0, eloB);
            }
        };

        const uscf = {
            default: 32,
            2000: 24,
            2400: 16
        };
        const elo = new Elo(uscf, 500, 3000);

        const eloDeckMap = {};
        const deckMap = new Map();

        while (true) {
            const batch = await download();
            if (!batch.length) break;
            batch.forEach((game, i) => {
                if (game.winner_deck_id === 'undefined' || game.loser_deck_id === 'undefined') {
                    return;
                }

                scoreGame(game, deckMap, eloDeckMap);
            });
        }

        let decks = [];
        for (const deck of deckMap.values()) {
            if (deck.wins + deck.losses >= 30 && deck.player !== 'anonymous') {
                deck.elo = eloDeckMap[deck.id];
                decks.push(deck);
            }
        }

        decks = decks.sort((a, b) => b.elo - a.elo);
        decks = decks.slice(0, 300);

        // SECOND PASS

        const idsSecondPass = _.uniq(_.flatten(_.map(decks, 'gameIDs')));
        if (idsSecondPass.length === 0) {
            client.release();
            return;
        }

        const eloDeckMapSecondPass = {};
        const eloDeckMapSecondPassPrevious = {};

        const games = await client.query(`
      SELECT
        id,
        winner,
        winner_deck_id,
        winner_deck_name,
        loser,
        loser_deck_id,
        loser_deck_name,
        date
      FROM
        games
      WHERE
        id IN (${idsSecondPass.join(', ')});
    `);

        const oneDayAgo = moment().subtract(24, 'hour');
        const deckMapSecondPass = new Map();
        const deckMapSecondPassPrevious = new Map();
        _.forEach(
            games.rows.sort((a, b) => a.id - b.id),
            (game, i) => {
                if (game.winner_deck_id === 'undefined' || game.loser_deck_id === 'undefined') {
                    return;
                }
                scoreGame(game, deckMapSecondPass, eloDeckMapSecondPass);

                const inPreviousGroup = moment(game.date).isBefore(oneDayAgo);
                if (inPreviousGroup) {
                    scoreGame(game, deckMapSecondPassPrevious, eloDeckMapSecondPassPrevious);
                }
            }
        );

        const decksSecondPass = [];
        for (const deck of deckMapSecondPass.values()) {
            if (deck.wins + deck.losses >= 30 && deck.player !== 'anonymous') {
                delete deck.gameIDs;
                deck.elo = eloDeckMapSecondPass[deck.id];
                decksSecondPass.push(deck);
            }
        }

        leaderboardCache = _.sortBy(decksSecondPass, 'elo').reverse().slice(0, 300);

        const decksSecondPassPrevious = [];
        for (const deck of deckMapSecondPassPrevious.values()) {
            if (deck.wins + deck.losses >= 30 && deck.player !== 'anonymous') {
                delete deck.gameIDs;
                deck.elo = eloDeckMapSecondPassPrevious[deck.id];
                decksSecondPassPrevious.push(deck);
            }
        }

        leaderboardPastCache = _.sortBy(decksSecondPassPrevious, 'elo').reverse().slice(0, 300);

        if (leaderboardCache.length && leaderboardCache[0].player !== 'anonymous') {
            await client.query(
                `
       INSERT INTO
         deck_awards (id, type, player, deck_uuid, date_created)
       VALUES
         (DEFAULT, $1, $2, $3, $4)
       ON CONFLICT ON CONSTRAINT deck_awards_deck_player_constraint
       DO UPDATE SET
         date_created = $4
     `,
                [
                    '1st-on-leaderboard',
                    leaderboardCache[0].player,
                    leaderboardCache[0].deckID,
                    new Date().toISOString()
                ]
            );
        }

        client.release();
    };

    setInterval(async () => {
        await buildLeaderboard();
    }, 1000 * 60 * 10);

    setTimeout(async () => {
        await buildLeaderboard();
    }, 1000 * 10);

    app.get('/api/leaderboards', async (req, res) => {
        try {
            if (!leaderboardCache) {
                res.json({
                    leaderboards: [
                        {
                            name: 'Please refresh in 10 seconds...',
                            decks: []
                        }
                    ]
                });
                return;
            }

            res.json({
                leaderboards: [
                    {
                        name: 'Leaderboard',
                        decks: leaderboardCache,
                        previousVersion: leaderboardPastCache
                    }
                ]
            });
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });
};

module.exports = {
    setupRoutes
};
