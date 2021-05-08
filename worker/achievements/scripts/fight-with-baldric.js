const toGameLog = require('../utils/toGameLog');

module.exports = {
  id: 'fight-with-baldric',
  check: ({
    player,
    events,
  }) => {
    const regex = new RegExp(`${player} uses Baldric the Bold to gain 2 amber`);
    return !!toGameLog(events).find((line) => regex.test(line));
  }
};
