const { Pool } = require('pg');
const storeGameBoards = require('./game-board');
const createGameSummary = require('./game-summary');
const achievements = require('./achievements');
const cardPlays = require('./card-plays');
const ConfigService = require('./services/ConfigService');
const logger = require('../shared/log');

const configService = new ConfigService();

const dbPool = new Pool({
    user: configService.getValue('dbUser'),
    host: configService.getValue('dbHost'),
    database: configService.getValue('dbDatabase'),
    password: configService.getValue('dbPassword'),
    port: configService.getValue('dbPort'),
    ssl: false
});

logger.info('[worker] Started');
storeGameBoards.consume(dbPool);
createGameSummary.consume(dbPool);

require('./card-play-leaderboard')(dbPool);

setTimeout(() => {
    achievements.fillQueue(dbPool);
    achievements.consume(dbPool);
}, 1000 * 10);

setTimeout(() => {
    cardPlays.fillQueue(dbPool);
    cardPlays.consume(dbPool);
}, 1000 * 5);
