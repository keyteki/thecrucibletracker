module.exports = {
  id: 'play-2000-games',
  defaultProgress: 1,
  check: ({
    player,
    game,
    summary,
    events,
    progress,
  }) => {
    if (player === game.winner || player === game.loser) {
      progress += 1;
    }

    return {
      awarded: progress >= 2000,
      progress,
    };
  }
};
