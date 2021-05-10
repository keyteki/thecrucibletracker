const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'steal-5-with-tmtp',
    check: ({ player, events }) =>
        !!toGameLog(events).find((line) => {
            const regex = new RegExp(`${player} uses Too Much to Protect to steal.*`);
            if (regex.test(line)) {
                const amount = Number.parseInt(
                    line
                        .replace(`${player} uses Too Much to Protect to steal `, '')
                        .replace(' amber from ', ''),
                    10
                );
                return amount >= 5;
            }
        })
};

// {
// "id": "eec0eb30-371a-11eb-913f-db493a8d782b",
// "date": "2020-12-05T16:57:17.923Z",
// "message": [
// {
// "name": "Fone",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "Too Much to Protect",
// "image": "too-much-to-protect",
// "label": "Too Much to Protect",
// "type": "action",
// "cardPrintedAmber": 1,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "steal 3 amber from ",
// {
// "message": [
// {
// "name": "Brobnar89",
// "argType": "nonAvatarPlayer",
// "role": "user"
// }
// ]
// }
// ]
// }
// ],
// "activePlayer": "Fone"
// },
//
//
