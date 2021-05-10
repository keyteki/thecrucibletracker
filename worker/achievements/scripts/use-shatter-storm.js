const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'use-shatter-storm',
    check: ({ player, events }) => {
        const regex = new RegExp(`${player} uses Shatter Storm`);
        return toGameLog(events).find((line) => {
            const match = regex.test(line);
            if (match) {
                const amount = Number.parseInt(
                    line
                        .slice(line.indexOf(' lose '))
                        .replace('lose', '')
                        .replace('amber', '')
                        .trim(),
                    10
                );
                return amount >= 6;
            }
        });
    }
};
