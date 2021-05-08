const toGameLog = require('../utils/toGameLog');

module.exports = {
  id: 'wild-wormhole-wild-wormhole',
  check: ({
    player,
    events,
  }) => {
    const regex = new RegExp(`${player} uses Wild Wormhole to play( .*)? Wild Wormhole`);
    return !!toGameLog(events).find((line) => regex.test(line));
  }
};
