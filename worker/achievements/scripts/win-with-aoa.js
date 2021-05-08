const expansions = require('../../../expansions');

module.exports = {
  id: 'win-with-aoa',
  check: ({
    player,
    game,
    summary,
    events,
  }) => game.winner === player && game.winner_deck_expansion === expansions.aoa
};
