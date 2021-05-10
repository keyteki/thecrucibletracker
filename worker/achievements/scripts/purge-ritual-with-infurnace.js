const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'purge-ritual-with-infurnace',
    check: ({ player, events }) => {
        const regex = new RegExp(`${player} uses Infurnace to purge .*Ritual of Tognath.*`);
        return !!toGameLog(events).find((line) => regex.test(line));
    }
};
