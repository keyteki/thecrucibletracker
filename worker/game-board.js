const REDIS_CONNECTION_STRING = process.env.REDIS_URL;
const Queue = require('bull');

const consume = (dbPool) => {
    console.log('[worker::game board] Launching');

    const queue = new Queue('game board', REDIS_CONNECTION_STRING);

    queue.process(async (job, done) => {
        const { gameID, turn, board } = job.data;

        let { hand, purged, archives } = job.data;
        hand = hand || {};
        purged = purged || {};
        archives = archives || {};

        let persistedHandData;
        let persistedArchivesData;

        try {
            const query =
                'SELECT id, hand, archives FROM board_states WHERE crucible_game_id = $1 AND turn = $2';
            const queryResponse = await dbPool.query(query, [gameID, turn]);
            if (queryResponse.rows.length) {
                persistedHandData = queryResponse.rows[0].hand;
                persistedArchivesData = queryResponse.rows[0].archives;
            }
        } catch (err) {
            console.error(err);
            return done();
        }

        if (
            persistedHandData &&
            Object.keys(persistedHandData).length &&
            Object.keys(hand).length
        ) {
            Object.keys(hand).forEach((player) => {
                if (
                    hand[player][0] === '' &&
                    persistedHandData[player] &&
                    persistedHandData[player][0] !== ''
                )
                    return;

                persistedHandData[player] = hand[player];
            });
            Object.keys(archives).forEach((player) => {
                if (
                    archives[player][0] === '' &&
                    persistedArchivesData[player] &&
                    persistedArchivesData[player][0] !== ''
                )
                    return;
                persistedArchivesData[player] = archives[player];
            });

            let client;
            try {
                client = await dbPool.connect();
                const query =
                    'UPDATE board_states SET hand = $3, archives = $4 WHERE crucible_game_id = $1 AND turn = $2';
                await client.query(query, [
                    gameID,
                    turn,
                    JSON.stringify(persistedHandData),
                    JSON.stringify(persistedArchivesData)
                ]);
            } catch (err) {
                console.error(err);
            }
            if (client) {
                client.release();
            }
        } else {
            let client;
            try {
                client = await dbPool.connect();
                const query = 'INSERT INTO board_states VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)';
                await client.query(query, [
                    gameID,
                    turn,
                    JSON.stringify(board),
                    JSON.stringify(hand),
                    JSON.stringify(archives),
                    JSON.stringify(purged)
                ]);
            } catch (err) {
                console.error(err);
            }
            if (client) {
                client.release();
            }
        }

        done();
    });
};

module.exports = {
    consume
};
