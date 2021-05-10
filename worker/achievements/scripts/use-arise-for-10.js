module.exports = {
    id: 'use-arise-for-10',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Arise!' &&
                e.message[3] === ' to ' &&
                e.message[4] &&
                e.message[4].message &&
                e.message[4].message[1] &&
                e.message[4].message[1].message &&
                e.message[4].message[1].message.filter((m) => !!m.name).length >= 10
        )
};

// {
// "date": "2020-08-21T09:46:12.869Z",
// "message": [
// {
// "name": "Landros83",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "Arise!",
// "image": "arise",
// "label": "Arise!",
// "type": "action",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "return ",
// {
// "message": [
// {
// "name": "Urchin",
// "image": "urchin",
// "label": "Urchin",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Urchin",
// "image": "urchin",
// "label": "Urchin",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Silvertooth",
// "image": "silvertooth",
// "label": "Silvertooth",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Old Bruno",
// "image": "old-bruno",
// "label": "Old Bruno",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", and ",
// {
// "name": "Umbra",
// "image": "umbra",
// "label": "Umbra",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// }
// ]
