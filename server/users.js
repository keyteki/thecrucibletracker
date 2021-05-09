const moment = require('moment');
const _ = require('lodash');
const {
    trackPlayer,
    isPublic,
    cleanGame,
    cleanGameSummary,
    cleanGameTimeline
} = require('../privacy');
const calculateUserLevel = require('../shared/calculateUserLevel');

const userLevelCache = {};
const achievementGlobalCompletionCache = {};

const setupRoutes = (app, dbPool) => {
    const loadAchievementCompletion = async () => {
        const client = await dbPool.connect();
        const numPlayersResponse = await client.query(`
      SELECT
        COUNT(DISTINCT player)
      FROM
        achievements
    `);
        const numPlayers = Number.parseInt(numPlayersResponse.rows[0].count, 10);
        const achievementsResponse = await client.query(`
      SELECT
        DISTINCT name
      FROM
        achievements
    `);

        for (const achievement of achievementsResponse.rows) {
            const countResponse = await client.query(
                `
        SELECT
          COUNT(*)
        FROM
          achievements
        WHERE name = $1 AND date_awarded_on IS NOT NULL
      `,
                [achievement.name]
            );
            const percentage =
                (Number.parseInt(countResponse.rows[0].count, 10) / numPlayers) * 100;
            achievementGlobalCompletionCache[achievement.name] = percentage;
        }
    };

    loadAchievementCompletion();

    app.get('/api/users/:username/level', async (req, res) => {
        try {
            const user = req.params.username;

            if (userLevelCache[user]) {
                if (moment().isAfter(userLevelCache[user].expire)) {
                    delete userLevelCache[user];
                } else {
                    const { level, progress } = userLevelCache[user];
                    res.json({
                        level,
                        progress
                    });
                    return;
                }
            }

            const client = await dbPool.connect();
            const gamesQuery = `
        SELECT
          winner
        FROM
          games
        WHERE
          games.winner = $1 OR games.loser = $1
      `;
            const gamesQueryResult = await client.query(gamesQuery, [user]);
            const games = gamesQueryResult.rows.map(cleanGame);

            const achievementQuery = `	
        SELECT
          date_awarded_on
        FROM
          achievements
        WHERE
          player = $1	
      `;
            const achievementsQueryResult = await client.query(achievementQuery, [user]);
            const achievements = achievementsQueryResult.rows;

            client.release();

            let { level, progress } = calculateUserLevel({
                user,
                games,
                achievements
            });

            const isAnonymous = !isPublic(user);
            if (isAnonymous) {
                level = 1;
                progress = 0;
            }

            userLevelCache[user] = {
                level,
                progress,
                expireAt: moment().add(15, 'm')
            };

            res.json({
                level,
                progress
            });
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/user-games/:username/games', async (req, res) => {
        try {
            const client = await dbPool.connect();
            const query = `
        SELECT
          games.id,
          games.crucible_game_id,
          games.date,
          games.turns,
          games.winner,
          games.winner_deck_id,
          games.winner_deck_name,
          games.loser,
          games.loser_deck_id,
          games.loser_deck_name
        FROM
          games
          LEFT OUTER JOIN game_summary ON (games.id = game_summary.game_id)
        WHERE
          games.turns > 2 AND (games.winner = $1 OR games.loser = $2)
      `;

            const queryResult = await client.query(query, [
                req.params.username,
                req.params.username
            ]);
            client.release();

            let games = queryResult.rows.map(cleanGame);

            games = _.uniqBy(games, (game) => {
                if (game.crucible_game_id) return game.crucible_game_id;
                return game.id;
            });

            res.json(games);
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/users/:username/games', async (req, res) => {
        try {
            const client = await dbPool.connect();
            const query = `
        SELECT
          games.id,
          games.crucible_game_id,
          games.date,
          games.turns,
          games.winner,
          games.winner_deck_id,
          games.winner_deck_name,
          games.winner_keys,
          games.winner_checks,
          games.loser,
          games.loser_deck_id,
          games.loser_deck_name,
          games.loser_keys,
          games.loser_checks,
          games.winner_deck_expansion,
          games.loser_deck_expansion
        FROM
          games
        WHERE
          games.winner = $1
          OR games.loser = $2
      `;

            const queryResult = await client.query(query, [
                req.params.username,
                req.params.username
            ]);
            client.release();
            res.json(queryResult.rows.map(cleanGame));
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/users/:username/awards', async (req, res) => {
        try {
            const latestResponse = await dbPool.query(`
        SELECT
          *
        FROM
          deck_awards
        ORDER BY
          date_created DESC
        LIMIT 1
      `);
            const response = await dbPool.query(
                `
        SELECT
          *
        FROM
          deck_awards
        WHERE
          player = $1
      `,
                [req.params.username]
            );
            const awards = response.rows.map((row) => {
                if (row.id === _.get(latestResponse, 'rows[0].id')) {
                    row.current = true;
                }
                return row;
            });
            res.json({
                awards
            });
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/users/:username/decks/:deckID/games', async (req, res) => {
        try {
            const client = await dbPool.connect();
            const query = `
        SELECT
          games.id,
          games.crucible_game_id,
          games.date,
          games.turns,
          games.winner,
          games.winner_deck_id,
          games.winner_deck_name,
          games.winner_keys,
          games.winner_checks,
          games.loser,
          games.loser_deck_id,
          games.loser_deck_name,
          games.loser_keys,
          games.loser_checks,
          games.winner_deck_expansion,
          games.loser_deck_expansion
        FROM
          games
        WHERE
          (winner = $1 AND winner_deck_id = $2)
          OR (loser = $3 AND loser_deck_id = $4)
      `;
            const queryResult = await client.query(query, [
                req.params.username,
                req.params.deckID,
                req.params.username,
                req.params.deckID
            ]);
            client.release();
            res.json(queryResult.rows.map(cleanGame));
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/users/:username/game-summaries', async (req, res) => {
        try {
            const client = await dbPool.connect();
            const query = 'SELECT * FROM game_summary WHERE winner = $1 OR loser = $2';
            const queryResult = await client.query(query, [
                req.params.username,
                req.params.username
            ]);
            client.release();
            res.json(queryResult.rows.map(cleanGameSummary));
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/users/:username/decks/:deckID/game-summaries', async (req, res) => {
        let gameIDs = [];

        try {
            const client = await dbPool.connect();
            const query =
                'SELECT * FROM games WHERE (winner = $1 AND winner_deck_id = $2) OR (loser = $1 AND loser_deck_id = $2)';
            const queryResult = await client.query(query, [req.params.username, req.params.deckID]);
            client.release();
            gameIDs = queryResult.rows.map((row) => row.id);
        } catch (err) {
            console.error(err);
        }

        if (!gameIDs.length) {
            res.json([]);
            return;
        }

        try {
            const client = await dbPool.connect();
            const query = `SELECT * FROM game_summary WHERE game_id IN (${gameIDs.join(', ')}) `;
            const queryResult = await client.query(query);
            client.release();
            res.json(queryResult.rows.map(cleanGameSummary));
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/users/:username/game-timelines', async (req, res) => {
        try {
            const client = await dbPool.connect();
            const query = 'SELECT * FROM game_timeline WHERE winner = $1 OR loser = $1';
            const queryResult = await client.query(query, [req.params.username]);
            client.release();
            res.json(queryResult.rows.map(cleanGameTimeline));
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/users/:username/decks/:deckID/game-timelines', async (req, res) => {
        let gameIDs = [];

        try {
            const client = await dbPool.connect();
            const query =
                'SELECT * FROM games WHERE (winner = $1 AND winner_deck_id = $2) OR (loser = $1 AND loser_deck_id = $2)';
            const queryResult = await client.query(query, [req.params.username, req.params.deckID]);
            client.release();
            gameIDs = queryResult.rows.map((row) => row.id);
        } catch (err) {
            console.error(err);
        }

        if (!gameIDs.length) {
            res.json([]);
            return;
        }

        try {
            const client = await dbPool.connect();
            const query = `SELECT * FROM game_timeline WHERE game_id IN (${gameIDs.join(', ')}) `;
            const queryResult = await client.query(query);
            client.release();
            res.json(queryResult.rows.map(cleanGameTimeline));
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/users/:username/achievements', async (req, res) => {
        try {
            const client = await dbPool.connect();
            const query = `	
        SELECT *	
        FROM achievements
        WHERE player = $1	
      `;
            const queryResponse = await client.query(query, [req.params.username]);
            client.release();

            const achievements = queryResponse.rows.map((achievement) => ({
                ...achievement,
                globalCompletion: achievementGlobalCompletionCache[achievement.name] || 0
            }));

            res.json({
                achievements
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
