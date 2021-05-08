const { allPlayerStateUpdatesArePresent, } = require('./aember');

const parse = (events) => {
  if (!allPlayerStateUpdatesArePresent(events)) {
    return [];
  }

  const firstPlayer = events.find((event) => event.message
      && event.message.alert
      && event.message.alert.type === 'endofround').message.alert.message[2].name;

  let turnAt = 1;
  const turns = [];
  const keys = {};

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.type === 'PLAYER_STATE_UPDATE') {
      const players = Object.keys(event.players);
      keys[players[0]] = event.players[players[0]].keys;
      keys[players[1]] = event.players[players[1]].keys;
    }

    if (Array.isArray(event.message) && /: \d+ amber .*: \d+ amber/.test(event.message[0])) {
      let line = event.message[0]
        .replace(new RegExp(' \\(0 keys\\)'), '')
        .replace(new RegExp(' \\(1 key\\)'), '')
        .replace(new RegExp(' \\(2 keys\\)'), '')
        .replace(new RegExp(' \\(3 keys\\)'), '');
      line = line
        .replace(new RegExp(' \\(0 keys\\)'), '')
        .replace(new RegExp(' \\(1 key\\)'), '')
        .replace(new RegExp(' \\(2 keys\\)'), '')
        .replace(new RegExp(' \\(3 keys\\)'), '');
      const matches = line.match(/(\w+): ([0-9]*) amber (\w+): ([0-9]*) amber/);
      const playerA = matches[1];
      const amountPlayerA = Number.parseInt(matches[2], 10);

      const playerB = matches[3];
      const amountPlayerB = Number.parseInt(matches[4], 10);

      const activePlayer = turnAt % 2 === 0 ? (firstPlayer === playerA ? playerB : playerA) : firstPlayer;

      turns.push({
        turn: turnAt,
        player: playerA,
        aember: amountPlayerA,
        keys: keys[playerA],
        activePlayer,
      });

      turns.push({
        turn: turnAt,
        player: playerB,
        aember: amountPlayerB,
        keys: keys[playerB],
        activePlayer,
      });

      turnAt += 0.5;
    }

    if (
      event.message
      && event.message.alert
      && event.message.alert.message
      && event.message.alert.message[1] === ' has won the game'
    ) {
      const nextUpdateEvent = events.slice(i).find((e) => e.type === 'PLAYER_STATE_UPDATE');
      if (nextUpdateEvent) {
        const players = Object.keys(nextUpdateEvent.players);

        turns.push({
          turn: turnAt,
          player: players[0],
          aember: nextUpdateEvent.players[players[0]].keys,
          keys: nextUpdateEvent.players[players[0]].keys,
        });

        turns.push({
          turn: turnAt,
          player: players[1],
          aember: nextUpdateEvent.players[players[1]].keys,
          keys: nextUpdateEvent.players[players[1]].keys,
        });
      }
    }
  }

  return turns;
};

module.exports = parse;
