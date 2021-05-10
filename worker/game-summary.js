const ConfigService = require('../shared/ConfigService');
const configService = new ConfigService();

const REDIS_CONNECTION_STRING = configService.getValue('redisUrl');

const _ = require('lodash');
const Queue = require('bull');
const parseEvents = require('../event-parser');
const parseTurns = require('../event-parser/turn-parser');

const fetchEventsFor = async (dbPool, gameID) => {
    const client = await dbPool.connect();
    const response = await client.query('SELECT * FROM events WHERE game_id = $1', [gameID]);
    await client.release();

    if (response.rows.length === 0) return;

    const { events } = response.rows[0];
    return events;
};

const deleteSummary = async (dbPool, gameID) => {
    const client = await dbPool.connect();
    await client.query('DELETE FROM ONLY game_summary WHERE game_id = $1', [gameID]);
    await client.release();
};

const storeSummary = async (dbPool, gameID, summary) => {
    const data = {
        game_id: gameID,
        winner: summary.winner.name,
        winner_turns_dis: summary.winner.turnsDis,
        winner_turns_shadows: summary.winner.turnsShadows,
        winner_turns_brobnar: summary.winner.turnsBrobnar,
        winner_turns_mars: summary.winner.turnsMars,
        winner_turns_untamed: summary.winner.turnsUntamed,
        winner_turns_logos: summary.winner.turnsLogos,
        winner_turns_sanctum: summary.winner.turnsSanctum,
        winner_did_mulligan: summary.winner.didMulligan,
        winner_actions_played: summary.winner.actionsPlayed,
        winner_creatures_played: summary.winner.creaturesPlayed,
        winner_artifacts_played: summary.winner.artifactsPlayed,
        winner_cards_discarded: summary.winner.cardsDiscarded,
        winner_cards_drawn: summary.winner.cardsDrawn,
        winner_cards_archived: summary.winner.cardsArchived,
        winner_total_aember_gained: summary.winner.aemberTotalGained,
        loser: summary.loser.name,
        loser_turns_dis: summary.loser.turnsDis,
        loser_turns_shadows: summary.loser.turnsShadows,
        loser_turns_brobnar: summary.loser.turnsBrobnar,
        loser_turns_mars: summary.loser.turnsMars,
        loser_turns_untamed: summary.loser.turnsUntamed,
        loser_turns_logos: summary.loser.turnsLogos,
        loser_turns_sanctum: summary.loser.turnsSanctum,
        loser_did_mulligan: summary.loser.didMulligan,
        loser_actions_played: summary.loser.actionsPlayed,
        loser_creatures_played: summary.loser.creaturesPlayed,
        loser_artifacts_played: summary.loser.artifactsPlayed,
        loser_cards_discarded: summary.loser.cardsDiscarded,
        loser_cards_drawn: summary.loser.cardsDrawn,
        loser_cards_archived: summary.loser.cardsArchived,
        loser_total_aember_gained: summary.loser.aemberTotalGained,
        loser_aember_captured: summary.loser.aemberCaptured,
        winner_aember_captured: summary.winner.aemberCaptured,
        winner_chains_starting: summary.winner.chainsStarting,
        winner_chains_gained: summary.winner.chainsGained,
        loser_chains_starting: summary.loser.chainsStarting,
        loser_chains_gained: summary.loser.chainsGained,
        winner_aember_pips_gained: summary.winner.aemberGainedFromCardPips,
        loser_aember_pips_gained: summary.loser.aemberGainedFromCardPips,
        winner_aember_reap_gained: summary.winner.aemberGainedFromReaping,
        loser_aember_reap_gained: summary.loser.aemberGainedFromReaping,
        winner_turns_saurian: summary.winner.turnsSaurian,
        loser_turns_saurian: summary.loser.turnsSaurian,
        winner_turns_star_alliance: summary.winner.turnsStarAlliance,
        loser_turns_star_alliance: summary.loser.turnsStarAlliance,
        winner_upgrades_played: summary.winner.upgradesPlayed,
        loser_upgrades_played: summary.loser.upgradesPlayed
    };

    let query = 'INSERT INTO game_summary VALUES (DEFAULT, ';
    const keys = Object.keys(data);

    keys.forEach((key, i) => {
        query += `$${i + 1}, `;
    });
    query = query.slice(0, -2);
    query += ') RETURNING id;';

    const array = [];
    keys.forEach((key) => {
        array.push(data[key]);
    });

    const client = await dbPool.connect();
    await client.query(query, array);
    await client.release();
};

const deleteTurns = async (dbPool, gameID) => {
    const client = await dbPool.connect();
    await client.query('DELETE FROM ONLY game_timeline WHERE game_id = $1', [gameID]);
    await client.release();
};

const storeTurns = async (dbPool, gameID, winner, loser, turns) => {
    const query = 'INSERT INTO game_timeline VALUES (DEFAULT, $1, $2, $3, $4)';
    const array = [gameID, winner, loser, JSON.stringify(turns)];

    const client = await dbPool.connect();
    await client.query(query, array);
    await client.release();
};

const consume = (dbPool) => {
    const queue = new Queue('game summary', REDIS_CONNECTION_STRING);

    queue.process(async (job, done) => {
        const { gameID } = job.data;
        if (_.isString(gameID)) {
            console.log(`Skipping game summary ${gameID}`);
            return done();
        }

        const events = await fetchEventsFor(dbPool, gameID);
        if (!events) {
            console.log(`Skipping game summary ${gameID}`);
            return done();
        }

        try {
            const summary = parseEvents(events);
            await deleteSummary(dbPool, gameID);
            await storeSummary(dbPool, gameID, summary);
            const turns = parseTurns(events);
            await deleteTurns(dbPool, gameID);
            await storeTurns(dbPool, gameID, summary.winner.name, summary.loser.name, turns);
            console.log(`Finished game summary ${gameID}`);
        } catch (e) {
            console.log(e);
            done();
            return;
        }
        done();
    });
};

module.exports = {
    consume
};
