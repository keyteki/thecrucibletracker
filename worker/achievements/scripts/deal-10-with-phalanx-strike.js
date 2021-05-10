module.exports = {
    id: 'deal-10-with-phalanx-strike',
    check: ({ player, game, summary, events }) =>
        !!events.find((e) => {
            const isEvent =
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Phalanx Strike' &&
                e.message[4] &&
                e.message[4].message &&
                e.message[4].message[0] === 'deal ';
            if (isEvent) {
                const amount = e.message[4].message[1];
                return amount >= 10;
            }
        })
};

// {
// "id": "21a7e220-371a-11eb-913f-db493a8d782b",
// "date": "2020-12-05T16:51:33.826Z",
// "message": [
// {
// "name": "marcush92",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "Phalanx Strike",
// "image": "phalanx-strike",
// "label": "Phalanx Strike",
// "type": "action",
// "cardPrintedAmber": 1,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "deal ",
// 4,
// " damage to ",
// {
// "name": "Tribune Pompitus",
// "image": "tribune-pompitus",
// "label": "Tribune Pompitus",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// }
// ]
// }
// ],
// "activePlayer": "marcush92"
// },
