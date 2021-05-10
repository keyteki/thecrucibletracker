const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'exhume-ronnie',
    check: ({ player, events }) => {
        const regex = new RegExp(`${player} uses Exhume to play Ronnie Wristclocks`);
        return !!toGameLog(events).find((line) => regex.test(line));
    }
};
