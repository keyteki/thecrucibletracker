const { Pool } = require('pg');
const achievements = require('./index');

const DATABASE_CONNECTION_STRING = process.env.DATABASE_URL;

const dbPool = new Pool({
  connectionString: DATABASE_CONNECTION_STRING,
  ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false },
});

console.log(`Connected to ${DATABASE_CONNECTION_STRING}`);
achievements.fillQueue(dbPool);
achievements.consume(dbPool);
