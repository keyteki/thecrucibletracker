const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'use-primal-relic',
    check: ({ player, events }) => {
        const regex = new RegExp(`${player} uses Primal Relic to remove all amber from .*`);
        return !!toGameLog(events).find((line) => regex.test(line));
    }
};
