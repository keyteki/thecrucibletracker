module.exports = {
    id: 'forge-3-keys-without-playing-creatures',
    check: ({ player, game, summary, events }) =>
        player === game.winner && summary.winner.creaturesPlayed === 0
};
