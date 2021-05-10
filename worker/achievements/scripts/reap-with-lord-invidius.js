module.exports = {
    id: 'reap-with-lord-invidius',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                ['Lord Invidius'].includes(e.message[2].name) &&
                e.message[3] === ' to ' &&
                e.message[4] &&
                e.message[4].message &&
                e.message[4].message[0] === 'apply a lasting effect to '
        )
};

// {
// "id": "2a336223-371a-11eb-b916-0fa15806b9ce",
// "date": "2020-12-05T16:51:48.162Z",
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
// "apply a lasting effect to ",
// {
// "message": [
// {
// "name": "Cowfyne",
// "image": "cowfyne",
// "label": "Cowfyne",
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
