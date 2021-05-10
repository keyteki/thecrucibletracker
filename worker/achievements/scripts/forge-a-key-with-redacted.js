module.exports = {
    id: 'forge-a-key-with-redacted',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === '[REDACTED]' &&
                /to/.test(e.message[3]) &&
                e.message[4] &&
                e.message[4].message &&
                /sacrifice/.test(e.message[4].message[0]) &&
                e.message[4].message[1].argType === 'card' &&
                e.message[4].message[1].name === '[REDACTED]' &&
                /forge a key/.test(e.message[4].message[2])
        )
};

// https://www.thecrucibletracker.com/games/6e4c6530-2e3b-11ea-8f01-c3dd366cb390
// {
// "date": "2020-01-03T15:24:12.827Z",
// "message": [
// {
// "name": "Ginopinoshow",
// "argType": "nonAvatarPlayer"
// },
// " uses ",
// {
// "name": "[REDACTED]",
// "image": "[redacted]",
// "label": "[REDACTED]",
// "type": "artifact",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "sacrifice ",
// {
// "name": "[REDACTED]",
// "image": "[redacted]",
// "label": "[REDACTED]",
// "type": "artifact",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " and forge a key at no cost"
// ]
// }
// ]
// },
