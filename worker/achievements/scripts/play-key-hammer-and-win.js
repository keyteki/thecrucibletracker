module.exports = {
  id: 'play-key-hammer-and-win',
  check: ({
    player,
    game,
    summary,
    events,
  }) => game.winner === player && !!events.find((e) => Array.isArray(e.message)
        && e.message[0].name === player
        && / plays /.test(e.message[1])
        && e.message[2].argType === 'card'
        && [ 'Key Hammer' ].includes(e.message[2].name))
};
