const expansions = require('../../../expansions');

module.exports = {
    id: 'win-with-dt',
    check: ({ player, game, summary, events }) =>
        game.winner === player && game.winner_deck_expansion === expansions.dt
};
