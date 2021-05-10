module.exports = {
    id: 'reap-with-sutterkin',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[3] === ' to ' &&
                e.message[4].message &&
                e.message[4].message[0] === 'reap with ' &&
                e.message[4].message[1] &&
                e.message[4].message[1].message &&
                e.message[4].message[1].message[0] &&
                ['Professor Sutterkin'].includes(e.message[4].message[1].message[0].name)
        )
};

// {
// "id": "28b85ae4-371a-11eb-b916-0fa15806b9ce",
// "date": "2020-12-05T16:51:45.678Z",
// "message": [
// {
// "name": "Annina83",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "Lord Invidius",
// "image": "lord-invidius",
// "label": "Lord Invidius",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "reap with ",
// {
// "message": [
// {
// "name": "Lord Invidius",
// "image": "lord-invidius",
// "label": "Lord Invidius",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// }
// ]
// }
// ]
// }
// ],
// "activePlayer": "Annina83"
// },
