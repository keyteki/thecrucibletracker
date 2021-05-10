const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'play-wild-bounty-fertility-chant',
    check: ({ player, events }) => {
        const regex = new RegExp(`${player} uses Wild Bounty to resolve.* Fertility Chant.*`);
        return !!toGameLog(events).find((line) => regex.test(line));
    }
};

// Ultra uses Wild Bounty to resolve the bonus icons of Fertility Chant an additional time
// stronglink uses Wild Bounty to resolve Fertility Chant's bonus icons
