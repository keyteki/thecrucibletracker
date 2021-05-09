const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const { uniqBy } = require('lodash');
const { cleanGame, cleanPlayerObject } = require('../privacy');

const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

let recentGames = [];
let totalGames = 0;

const loadSetupData = async () => {
    try {
        const query =
            'SELECT date, winner, loser, turns, crucible_game_id FROM games ORDER BY date DESC LIMIT 5';
        const queryResult = await dbPool.query(query);
        recentGames = queryResult.rows.map((g) => cleanGame(g));
        recentGames.forEach((game) => {
            game.crucibleGameID = game.crucible_game_id;
            delete game.crucible_game_id;
        });
    } catch (err) {
        console.error(err);
    }

    try {
        const query = 'SELECT COUNT(*) FROM GAMES';
        const queryResult = await dbPool.query(query);
        totalGames = Number.parseInt(queryResult.rows[0].count, 10);
    } catch (err) {
        console.error(err);
    }
};

loadSetupData();
setTimeout(loadSetupData, 20000);

const users = require('./users');
const games = require('./games');
const decks = require('./decks');
const leaderboard = require('./leaderboard');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50MB' }));
app.use(express.static('dist'));

users.setupRoutes(app, dbPool);
decks.setupRoutes(app, dbPool);
games.setupRoutes(app, dbPool);
leaderboard.setupRoutes(app, dbPool);

games.on(
    'new-game',
    ({ winner, winnerDeckID, loser, loserDeckID, turns, date, crucibleGameID }) => {
        const dup = recentGames.find(
            (game) => game.winner === winner && game.loser === loser && game.turns === turns
        );

        setTimeout(() => {
            if (!dup) {
                recentGames.pop();
                recentGames.unshift(
                    cleanGame({
                        winner,
                        loser,
                        date,
                        turns,
                        crucibleGameID
                    })
                );
                totalGames += 1;
            }
        }, 2000);
    }
);

app.get('/api/summary', async (req, res) => {
    res.json({
        recentGames,
        totalGames
    });
});

const recordedEventsForGame = {};
app.post('/api/events', async (req, res) => {
    try {
        const { events, gameID } = req.body;

        if (recordedEventsForGame[gameID]) {
            res.send('ok');
            return;
        }
        recordedEventsForGame[gameID] = true;

        const query = 'INSERT INTO events VALUES (DEFAULT, $1, $2)';
        await dbPool.query(query, [gameID, JSON.stringify(events).replace(/'/g, "''")]);
        res.send('ok');
    } catch (err) {
        console.error(err);
        res.send(`Error ${err}`);
    }
});

let cardPlayData = null;
const updateCardPlayLeaderboard = async () => {
    console.log('[card play leaderboard] Downloading data');
    try {
        const query = 'SELECT data FROM card_play_leaderboard ORDER BY date DESC LIMIT 1';
        const queryResult = await dbPool.query(query);
        cardPlayData = queryResult.rows[0].data.topPlays;

        Object.keys(cardPlayData).forEach((card) => {
            cardPlayData[card].topPlayers = cardPlayData[card].topPlayers.map(cleanPlayerObject);
        });
        console.log(`[card play leaderboard] Loaded ${Object.keys(cardPlayData).length} cards`);
    } catch (err) {
        console.error(err);
    }
};

setTimeout(updateCardPlayLeaderboard, 1000 * 2);
setInterval(updateCardPlayLeaderboard, 1000 * 60 * 10);

app.get('/api/cards', async (req, res) => {
    res.json(cardPlayData);
});

app.get('/images/:name', (req, res) => {
    const { name } = req.params;
    res.sendFile(path.join(`${__dirname}/../dist/${name}`));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../dist/index.html`));
});

let port = process.env.PORT;
if (port === undefined || port === '') {
    port = 8000;
}

app.listen(port);
console.log(`Listening on port ${port}`);
