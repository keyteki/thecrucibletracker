const { Pool } = require('pg');
const storeGameBoards = require('./game-board');
const createGameSummary = require('./game-summary');
const achievements = require('./achievements');
const cardPlays = require('./card-plays');

const DATABASE_CONNECTION_STRING = process.env.DATABASE_URL;

const dbPool = new Pool({
  connectionString: DATABASE_CONNECTION_STRING,
  ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false },
});

console.log('[worker] Started');
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
