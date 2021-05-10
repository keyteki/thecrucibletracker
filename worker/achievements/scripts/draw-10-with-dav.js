const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'draw-10-with-dav',
    check: ({ player, game, summary, events }) => {
        let draws = 0;

        const regex = new RegExp(`${player} uses Dark Æmber Vault to draw*`);
        toGameLog(events).forEach((line) => {
            if (regex.test(line)) {
                draws += 1;
            }
        });

        return draws >= 10;
    }
};

// {
// "id": "f49c2a30-3718-11eb-913f-db493a8d782b",
// "date": "2020-12-05T16:43:08.755Z",
// "message": [
// {
// "name": "agrandstudent",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "Dark Æmber Vault",
// "image": "dark-æmber-vault-saurian",
// "label": "Dark Æmber Vault",
// "type": "artifact",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "draw 1 cards"
// ]
// }
// ],
// "activePlayer": "agrandstudent"
// },
