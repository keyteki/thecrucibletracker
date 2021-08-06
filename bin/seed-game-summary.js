const fs = require('fs');
const Queue = require('bull');
const gamesIDs = require('../fixtures/game-ids.json');
const logger = require('../shared/log');
const ConfigService = require('../shared/ConfigService');

const configService = new ConfigService();
const redisUrl = configService.getValue('redisUrl');

const queueConfig = {
    attempts: 5,
    backoff: {
        type: 'exponential',
        delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: true
};

const main = async () => {
    const gameSummaryQueue = new Queue('game summary', 'redis://localhost:3004');
    for (const gameID of gamesIDs) {
        await gameSummaryQueue.add({ gameID }, queueConfig);

        logger.info(`Game summary ${gameID} queued`);
    }
};

main();
