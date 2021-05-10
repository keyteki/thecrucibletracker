const { Pool } = require('pg');
const achievements = require('./index');
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

logger.info('Connected to database');
achievements.fillQueue(dbPool);
achievements.consume(dbPool);
