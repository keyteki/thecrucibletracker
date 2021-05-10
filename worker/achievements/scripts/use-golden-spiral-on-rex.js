module.exports = {
    id: 'use-golden-spiral-on-rex',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'The Golden Spiral' &&
                e.message[3] === ' to ' &&
                e.message[4].message &&
                e.message[4].message[0] === 'exalt, ready and use ' &&
                e.message[4].message[1] &&
                e.message[4].message[1] &&
                e.message[4].message[1] &&
                ['Cincinnatus Rex'].includes(e.message[4].message[1].name)
        )
};

// {
// "id": "138b3230-3721-11eb-913f-db493a8d782b",
// "date": "2020-12-05T17:41:16.627Z",
// "message": [
// {
// "name": "Vinzard",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "The Golden Spiral",
// "image": "the-golden-spiral",
// "label": "The Golden Spiral",
// "type": "artifact",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "exalt, ready and use ",
// {
// "name": "Philophosaurus",
// "image": "philophosaurus",
// "label": "Philophosaurus",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// }
// ]
// }
// ],
// "activePlayer": "Vinzard"
// },
