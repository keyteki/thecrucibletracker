module.exports = {
    id: 'gamble-and-win',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Gambling Den' &&
                e.message[4] === 'gain'
        )
};

// },
// {
// "date": "2019-11-17T02:18:16.132Z",
// "message": [
// {
// "name": "Foolishbigj",
// "argType": "nonAvatarPlayer"
// },
// " uses ",
// {
// "name": "Gambling Den",
// "image": "gambling-den",
// "label": "Gambling Den",
// "type": "artifact",
// "cardPrintedAmber": 1,
// "argType": "card"
// },
// " to ",
// "gain",
// " 2 amber"
// ]
// },
