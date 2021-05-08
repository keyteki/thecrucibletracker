module.exports = {
  id: 'forge-3-keys-without-reaping',
  check: ({
    player,
    game,
    summary,
    events,
  }) => {
    if (player !== game.winner) return false;

    return summary.winner.aemberGainedFromReaping === 0;
  },
};
