const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'use-ruins-of-archonis',
    check: ({ player, events }) => {
        const regex = new RegExp(`${player} uses Ruins of Archonis to remove all amber from .*`);
        return !!toGameLog(events).find((line) => regex.test(line));
    }
};
