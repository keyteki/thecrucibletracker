const toGameLog = require('../utils/toGameLog');

module.exports = {
  id: 'rapid-evolution-fandangle',
  check: ({
    player,
    events,
  }) => {
    const regex = new RegExp(`${player} uses Rapid Evolution to place .* on Fandangle`);
    return !!toGameLog(events).find((line) => regex.test(line));
  }
};
