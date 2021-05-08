module.exports = {
  id: 'play-fertility-chant-3-times-and-win',
  check: ({
    player,
    game,
    summary,
    events,
  }) => {
    let plays = 0;

    events.forEach((e) => {
      if (Array.isArray(e.message)
        && e.message[0].name === player
        && / plays /.test(e.message[1])
        && e.message[2].argType === 'card'
        && e.message[2].name === 'Fertility Chant') {
        plays += 1;
      }
    });

    return player === game.winner && plays >= 3;
  },
};
