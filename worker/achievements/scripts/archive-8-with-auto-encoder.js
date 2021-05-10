const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'archive-8-with-auto-encoder',
    check: ({ player, game, summary, events }) => {
        let archives = 0;

        const regex = new RegExp(`${player} uses Auto-Encoder to archive.*`);
        toGameLog(events).forEach((line) => {
            if (regex.test(line)) {
                archives += 1;
            }
        });

        return archives >= 8;
    }
};
