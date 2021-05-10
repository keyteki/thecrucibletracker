const Queue = require('bull');
const _ = require('lodash');
const moment = require('moment');
const {
    cleanGame,
    cleanEvents,
    cleanBoards,
    cleanGameTimeline,
    trackPlayer,
    cleanUsername,
    isPublic
} = require('../privacy');
const logger = require('../shared/log');

const ConfigService = require('../shared/ConfigService');
const configService = new ConfigService();

const REDIS_CONNECTION_STRING = configService.getValue('redisUrl');

const gameSummaryQueue = new Queue('game summary', REDIS_CONNECTION_STRING);
const gameBoardQueue = new Queue('game board', REDIS_CONNECTION_STRING);
const achievementsQueue = new Queue('analyze games for achievements', REDIS_CONNECTION_STRING);

const callbacks = {};
const on = (event, callback) => {
    callbacks[event] = callbacks[event] || [];
    callbacks[event].push(callback);
};
const trigger = (event, data) => {
    callbacks[event] && callbacks[event].forEach((c) => c(data));
};

const setupRoutes = (app, dbPool) => {
    const recordedCrucibleGameIds = {};
    /* app.post('/api/games', async (req, res) => {
        const {
            turns,
            date,
            winner,
            winnerDeckName,
            winnerDeckID,
            winnerChecks,
            loser,
            loserDeckName,
            loserDeckID,
            loserChecks,
            crucibleGameID
        } = req.body;

        const { winnerKeys, loserKeys } = req.body;

        if (winnerDeckID === 'undefined' || loserDeckID === 'undefined') {
            res.send('ok');
            return;
        }

        if (turns <= 2) {
            logger.info(`Ignoring game from ${winner} and ${loser} because too few turns`);
            res.send('ok');
            return;
        }

        if (recordedCrucibleGameIds[crucibleGameID]) {
            logger.info(`Ignoring game from ${winner} and ${loser} because already recorded`);
            res.send('ok');
            return;
        }
        recordedCrucibleGameIds[crucibleGameID] = true;

        try {
            const query = 'SELECT id FROM games WHERE crucible_game_id = $1';
            const queryResponse = await dbPool.query(query, [crucibleGameID]);
            if (queryResponse.rows.length) {
                logger.info(`Ignoring game from ${winner} and ${loser} because is duplicate`);
                res.send({ id: queryResponse.rows[0].id });
                return;
            }
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
            return;
        }

        let gameID;
        try {
            const query =
                'INSERT INTO games VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id';
            const queryResponse = await dbPool.query(query, [
                winner,
                loser,
                turns,
                winnerDeckID,
                winnerDeckName.replace(/'/g, "''"),
                winnerKeys,
                winnerChecks,
                loserDeckID,
                loserDeckName.replace(/'/g, "''"),
                loserKeys,
                loserChecks,
                date,
                crucibleGameID,
                null,
                null
            ]);
            gameID = queryResponse.rows[0].id;
            res.send({ id: gameID });
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
        }

        trigger('new-game', {
            winner,
            winnerDeckID,
            loser,
            loserDeckID,
            turns,
            date,
            crucibleGameID
        });

        if (gameID) {
            setTimeout(() => {
                try {
                    gameSummaryQueue.add(
                        { gameID },
                        {
                            attempts: 5,
                            backoff: {
                                type: 'exponential',
                                delay: 1000
                            },
                            removeOnComplete: true,
                            removeOnFail: true
                        }
                    );

                    achievementsQueue.add(
                        { gameID },
                        {
                            removeOnComplete: true,
                            removeOnFail: true
                        }
                    );
                } catch (err) {
                    logger.error(err);
                }
            }, 5000);
        }
    });

    app.post('/api/games/:gameID/board', async (req, res) => {
        res.send('ok');

        const { gameID, turn, board, hand, purged, archives } = req.body;

        gameBoardQueue.add(
            {
                gameID,
                turn,
                board,
                hand,
                purged,
                archives
            },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true,
                removeOnFail: true
            }
        );
    });

    app.post('/api/games/starting-hand', async (req, res) => {
        const { gameID, player, hand, deckSet, deckID, houses } = req.body;

        trackPlayer(player);
        trigger('new-hand', {
            deckSet,
            gameID,
            deckID,
            houses
        });

        let handData = {};

        try {
            const query = 'INSERT INTO players VALUES (DEFAULT, $1) ON CONFLICT (name) DO NOTHING';
            await dbPool.query(query, [player]);
        } catch (err) {
            logger.error(err);
        }

        try {
            const query = 'SELECT * FROM starting_hands WHERE crucible_game_id = $1';
            const queryResponse = await dbPool.query(query, [gameID]);

            if (queryResponse.rows[0]) {
                handData = queryResponse.rows[0].hands;
                handData[player] = handData[player] || {};
                handData[player][hand.length] = hand;

                const query2 = 'UPDATE starting_hands SET hands = $1 WHERE crucible_game_id = $2';
                await dbPool.query(query2, [JSON.stringify(handData), gameID]);
                res.send('ok');
                return;
            }
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
            return;
        }

        handData[player] = handData[player] || {};
        handData[player][hand.length] = hand;

        try {
            const query = 'INSERT INTO starting_hands VALUES (DEFAULT, $1, $2)';
            await dbPool.query(query, [gameID, JSON.stringify(handData)]);
            res.send('ok');
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
        }
    });*/

    app.get('/api/games/:gameID/hands', async (req, res) => {
        try {
            const query = `
        SELECT
          *
        FROM
          starting_hands
        JOIN games ON (starting_hands.crucible_game_id = games.crucible_game_id)
        WHERE games.crucible_game_id = $1
        ORDER BY starting_hands.id DESC
        LIMIT 1
      `;
            const queryResult = await dbPool.query(query, [req.params.gameID]);
            if (queryResult.rows[0]) {
                const hands = {};
                _.map(queryResult.rows[0].hands, (data, key) => {
                    if (isPublic(key)) {
                        hands[key] = data;
                    }
                });

                res.json(hands);
            } else {
                res.json({});
            }
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/games/:gameID', async (req, res) => {
        try {
            const query = `
        SELECT
          *,
          games.winner,
          games.loser,
          games.id,
          games.crucible_game_id
        FROM
          games
        LEFT OUTER JOIN game_summary ON (games.id = game_summary.game_id)
        LEFT OUTER JOIN game_timeline ON (game_timeline.game_id = games.id)
        WHERE
          games.crucible_game_id = $1
      `;
            const queryResult = await dbPool.query(query, [req.params.gameID]);
            const game = cleanGame(queryResult.rows[0]);
            cleanGameTimeline(queryResult.rows[0]);
            res.json(game);
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/games/:gameID/player-times', async (req, res) => {
        try {
            const query = 'SELECT * FROM events WHERE game_id = $1';
            const queryResult = await dbPool.query(query, [req.params.gameID]);
            const { events } = queryResult.rows[0];

            const playerData = {};
            const firstTurn = events.find((event) =>
                _.get(event, 'message[1]').indexOf('is first player')
            );
            let startOfTurnTime = firstTurn.date;

            events.forEach((event) => {
                if (
                    _.get(event, 'message.alert.type') === 'endofround' &&
                    _.get(event, 'message.alert.message[0]') === 'Draw'
                ) {
                    const player = _.get(event, 'message.alert.message[2].name');

                    if (!playerData[player]) {
                        playerData[player] = {
                            timeTaken: 0,
                            turnTimes: {}
                        };
                    }

                    const turn = _.keys(playerData[player].turnTimes).length + 1;
                    const seconds = moment(event.date).unix() - moment(startOfTurnTime).unix();

                    playerData[player].timeTaken += seconds;
                    playerData[player].turnTimes[turn] = seconds;

                    startOfTurnTime = event.date;
                }
            });

            const playerA = Object.keys(playerData)[0];
            const playerB = Object.keys(playerData)[1];
            const playerATime = playerData[playerA].timeTaken;
            const playerBTime = playerData[playerB].timeTaken;

            const output = {};
            output[cleanUsername(playerA)] = {
                total: playerATime,
                turnTimes: playerData[playerA].turnTimes
            };
            output[cleanUsername(playerB)] = {
                total: playerBTime,
                turnTimes: playerData[playerB].turnTimes
            };

            res.json(output);
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
        }
    });

    const toGameLog = (events) => {
        let logs = [];

        events.forEach((event) => {
            if (typeof event === 'string' || typeof event === 'number') {
                logs.push(event);
            } else if (Array.isArray(event.message)) {
                const subLogs = toGameLog(event.message);
                logs = logs.concat(subLogs.join(''));
            } else if (event.message && event.message.alert) {
                const subLogs = toGameLog(event.message.alert.message);
                logs = logs.concat(subLogs.join(''));
            } else if (event.players) {
                1;
            } else if (typeof event === 'object') {
                logs.push(event.name || event.label);
            }
        });

        return logs;
    };

    app.get('/api/games/:gameID/log', async (req, res) => {
        try {
            const query =
                'SELECT * FROM events JOIN games ON (events.game_id = games.id) WHERE games.crucible_game_id = $1';
            const queryResult = await dbPool.query(query, [req.params.gameID]);
            if (queryResult.rows[0]) {
                const events = cleanEvents(queryResult.rows[0].events);
                res.json(toGameLog(events));
            } else {
                res.json([]);
            }
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/games/:gameID/board', async (req, res) => {
        try {
            const query =
                'SELECT turn, board, hand, purged, archives FROM board_states WHERE crucible_game_id = $1';
            const queryResult = await dbPool.query(query, [req.params.gameID]);
            res.json(cleanBoards(queryResult.rows));
        } catch (err) {
            logger.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/games/:uuid/replay', async (req, res) => {
        try {
            const response = await dbPool.query(
                `
        SELECT
          *
        FROM
          events
        JOIN
          games ON (events.game_id = games.id)
        WHERE
          games.crucible_game_id = $1
      `,
                [req.params.uuid]
            );

            if (!response.rows[0]) {
                return res.json({});
            }

            const events = cleanEvents(response.rows[0].events);
            return res.json({
                log: toGameLog(events)
            });
        } catch (e) {
            logger.info(e);
            res.json({});
        }
    });
};

module.exports = {
    setupRoutes,
    on
};
