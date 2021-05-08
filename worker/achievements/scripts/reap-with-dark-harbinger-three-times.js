module.exports = {
  id: 'reap-with-dark-harbinger-four-times',
  check: ({
    player,
    game,
    summary,
    events,
  }) => {
    let reaps = 0;

    for (let i = 0; i < events.length; i++) {
      const e = events[i];

      if (
        Array.isArray(e.message)
          && e.message[0].name === player
          && / uses /.test(e.message[1])
          && / to /.test(e.message[3])
          && e.message[4]
          && Array.isArray(e.message[4].message)
          && /reap with/.test(e.message[4].message[0])
          && e.message[4].message[1]
          && e.message[4].message[1].message
          && e.message[4].message[1].message[0]
          && e.message[4].message[1].message[0].name === 'Dark Harbinger'
      ) {
        reaps += 1;
      }

      if (reaps >= 4) {
        return true;
      }

      if (e.message && e.message.alert && e.message.alert.type === 'endofround') {
        reaps = 0;
      }
    }

    return reaps >= 4;
  }
};
