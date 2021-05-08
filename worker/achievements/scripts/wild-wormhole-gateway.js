const toGameLog = require('../utils/toGameLog');

module.exports = {
  id: 'wild-wormhole-gateway',
  check: ({
    player,
    events,
  }) => {
    const regex = new RegExp(`${player} uses Wild Wormhole to play( .*)? Gateway to Dis`);
    // wilki uses Wild Wormhole to play the top card of their deck: Wild Wormhole
    // wilki uses Wild Wormhole to play Gateway to Dis
    return !!toGameLog(events).find((line) => regex.test(line));
  }
};
