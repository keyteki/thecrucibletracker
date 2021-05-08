module.exports = {
  id: 'forge-3-keys-without-going-to-check',
  check: ({
    player,
    game,
    summary,
    events,
  }) => player === game.winner && game.winner_checks === 0,
};
