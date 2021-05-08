module.exports = {
  id: 'give-your-opponent-12-chains-in-a-game-you-win',
  check: ({
    player,
    game,
    summary,
    events,
  }) => {
    if (player !== game.winner) return false;

    return events.filter((e) => Array.isArray(e.message)
        && e.message[0].name === player
        && / plays /.test(e.message[1])
        && e.message[2].argType === 'card'
        && e.message[2].name === 'Binding Irons').length >= 4;
  },
};
