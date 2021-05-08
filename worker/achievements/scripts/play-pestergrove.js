module.exports = {
  id: 'play-pestergrove',
  check: ({
    player,
    game,
    summary,
    events,
  }) => !!events.find((e) => Array.isArray(e.message)
        && e.message[0].name === player
        && / plays /.test(e.message[1])
        && e.message[2].argType === 'card'
        && [ 'Pestergrove' ].includes(e.message[2].name))
};
