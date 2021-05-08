module.exports = {
  id: 'forge-a-key-with-epic-quest',
  check: ({
    player,
    events,
  }) => {
    const epicQuestEventIndexes = [];
    const endOfRoundEvent = null;

    events.forEach((e, i) => {
      if (Array.isArray(e.message)
        && e.message[0].name === player
        && / uses /.test(e.message[1])
        && e.message[2]
        && e.message[2].argType === 'card'
        && e.message[2].name === 'Epic Quest'
        && / to /.test(e.message[3])
        && e.message[4].message
        && e.message[4].message[0]
        && /forge a key/.test(e.message[4].message[0])) {
        epicQuestEventIndexes.push(i);
      }
    });

    if (!epicQuestEventIndexes.length) {
      return false;
    }

    for (const epicQuestEventIndex of epicQuestEventIndexes) {
      const endOfRoundEvent = events.slice(epicQuestEventIndex).find((e, i) => {
        endOfRoundEventIndex = epicQuestEventIndex + i;
        return e.message && e.message.alert && e.message.alert.type === 'endofround';
      });

      if (!endOfRoundEvent) {
        endOfRoundEventIndex = events.length;
      }

      const forgeKeyEvent = events.slice(epicQuestEventIndex, endOfRoundEventIndex).find((e, i) => Array.isArray(e.message)
          && e.message[0].name === player
          && /forges/.test(e.message[1]));

      if (forgeKeyEvent) {
        return true;
      }
    }
    return false;
  },
};
