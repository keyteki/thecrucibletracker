module.exports = {
  id: 'use-knowledge-is-power-to-gain-5-amber',
  check: ({
    player,
    game,
    summary,
    events,
  }) => !!events.find((e) => {
    const isEvent = Array.isArray(e.message)
        && e.message[0].name === player
        && / uses /.test(e.message[1])
        && e.message[2]
        && e.message[2].argType === 'card'
        && e.message[2].name === 'Knowledge is Power'
        && / to /.test(e.message[3])
        && e.message[4]
        && e.message[4].message
        && /gain \d+ amber/.test(e.message[4].message[0]);
    if (!isEvent) return;

    const number = e.message[4].message[0]
      .replace('gain ', '')
      .replace(' amber', '');
    const amount = parseInt(number, 10);
    return amount >= 5;
  })
};
