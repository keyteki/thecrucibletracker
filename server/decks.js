const {
  bind
} = require('./utils');
const {
  cleanGame,
} = require('../privacy');

const setupRoutes = (app, dbPool) => {
  bind(app, 'get', '/api/decks/:deckName', async (req, res) => {
    const queryWin = 'SELECT COUNT(*) FROM games WHERE winner_deck_name = $1';
    const queryResultWin = await dbPool.query(queryWin, [ req.params.deckName, ]);

    const queryLoss = 'SELECT COUNT(*) FROM games WHERE loser_deck_name = $1';
    const queryResultLoss = await dbPool.query(queryLoss, [ req.params.deckName, ]);

    res.json({
      wins: queryResultWin.rows[0].count,
      losses: queryResultLoss.rows[0].count,
    });
  });

  app.get('/api/decks/:deckID/games', async (req, res) => {
    try {
      const query = `
        SELECT
          games.id,
          games.crucible_game_id,
          games.date,
          games.turns,
          games.winner,
          games.winner_deck_id,
          games.winner_deck_name,
          games.winner_keys,
          games.winner_checks,
          games.winner_deck_expansion,
          games.loser,
          games.loser_deck_id,
          games.loser_deck_name,
          games.loser_keys,
          games.loser_checks,
          games.loser_deck_expansion
        FROM
          games
        WHERE
          winner_deck_id = $1
          OR loser_deck_id = $1
      `;
      const queryResult = await dbPool.query(query, [ req.params.deckID, ]);
      res.json(queryResult.rows.map(cleanGame));
    } catch (err) {
      console.error(err);
      res.send(`Error ${err}`);
    }
  });

  app.get('/api/decks', async (req, res) => {
    try {
      const query = 'SELECT turns, winner_deck_id, loser_deck_id FROM games';
      const queryResult = await dbPool.query(query);

      const deckMap = {};
      queryResult.rows.forEach(({ turns, winner_deck_id, loser_deck_id, }) => {
        if (turns > 2) {
          deckMap[winner_deck_id] = deckMap[winner_deck_id] || { wins: 0, losses: 0, };
          deckMap[loser_deck_id] = deckMap[loser_deck_id] || { wins: 0, losses: 0, };

          deckMap[winner_deck_id].wins += 1;
          deckMap[loser_deck_id].losses += 1;
        }
      });

      res.json({
        decks: deckMap,
      });
    } catch (err) {
      console.error(err);
      res.send(`Error ${err}`);
    }
  });
};

module.exports = {
  setupRoutes,
};
