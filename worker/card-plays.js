const _ = require('lodash');
const formatCardName = require('../formatCardName');

const fetchEventsFor = async (dbPool, gameID) => {
    const client = await dbPool.connect();
    const response = await client.query('SELECT * FROM events WHERE game_id = $1', [gameID]);
    await client.release();

    if (response.rows.length === 0) return;

    const { events } = response.rows[0];
    return events;
};

const fillQueue = async (dbPool) => {};

const getNextGameIDs = async (dbPool) => {
    const query =
        'SELECT id FROM games WHERE scanned_for_card_plays IS FALSE AND card_plays_hit_error IS FALSE LIMIT 10';
    const response = await dbPool.query(query);
    return _.map(response.rows, 'id');
};

const consume = (dbPool) => {
    setInterval(async () => {
        const ids = await getNextGameIDs(dbPool);
        if (!ids.length) {
            return;
        }

        for (const gameID of ids) {
            const events = await fetchEventsFor(dbPool, gameID);
            if (!events) {
                console.log(`[card-plays] Error at game ${gameID}`);
                await dbPool.query(
                    `
          UPDATE
            games
          SET
            card_plays_hit_error = TRUE
          WHERE
            id = $1
        `,
                    [gameID]
                );
                continue;
            }

            const cardPlays = {};
            const cardDiscards = {};

            events.forEach((e) => {
                try {
                    if (Array.isArray(e.message) && / plays /.test(e.message[1])) {
                        const card = formatCardName(e.message[2].label);
                        cardPlays[e.message[0].name] = cardPlays[e.message[0].name] || {};
                        cardPlays[e.message[0].name][card] = cardPlays[e.message[0].name][card] || {
                            played: 0
                        };
                        cardPlays[e.message[0].name][card].played += 1;
                    }

                    if (
                        Array.isArray(e.message) &&
                        / discards /.test(e.message[1]) &&
                        e.message[1] != ' adds a card to their hand and discards the other 2' &&
                        !e.message[3]
                    ) {
                        const card = formatCardName(e.message[2].label);
                        cardDiscards[e.message[0].name] = cardDiscards[e.message[0].name] || {};
                        cardDiscards[e.message[0].name][card] = cardDiscards[e.message[0].name][
                            card
                        ] || { count: 0 };
                        cardDiscards[e.message[0].name][card].count += 1;
                    }
                } catch (err) {
                    console.log('caught error', err);
                }
            });

            let query = '';

            Object.keys(cardPlays).forEach((player) => {
                Object.keys(cardPlays[player]).forEach((card) => {
                    const count = cardPlays[player][card].played;
                    query += `INSERT INTO card_plays VALUES (DEFAULT, '${card}', '${player}', ${count}) ON CONFLICT ON CONSTRAINT card_plays_pk DO UPDATE SET count = card_plays.count + ${count}; `;
                });
            });

            const clientForCardPlays = await dbPool.connect();
            await clientForCardPlays.query(query);
            await clientForCardPlays.query(
                `UPDATE games SET scanned_for_card_plays = TRUE WHERE id = ${gameID}`
            );
            clientForCardPlays.release();
        }
    }, 1000 * 10);
};

module.exports = {
    consume,
    fillQueue
};
