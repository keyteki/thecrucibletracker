// Uses Forging an Alliance to forge a key at +7 amber current cost, reduced by 1 amber for each house represented in play

// {
// "date": "2020-01-16T04:20:14.461Z",
// "message": [
// {
// "name": "RectangleCactus",
// "argType": "nonAvatarPlayer"
// },
// " uses ",
// {
// "name": "Forging an Alliance",
// "image": "forging-an-alliance",
// "label": "Forging an Alliance",
// "type": "action",
// "cardPrintedAmber": 1,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "forge a key at +7 amber current cost, reduced by 1 amber for each house represented in play"
// ]
// }
// ]
// },

module.exports = {
    id: 'forge-a-key-with-forging-an-alliance',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Forging an Alliance' &&
                /to/.test(e.message[3]) &&
                e.message[4] &&
                e.message[4].message &&
                /forge a key/.test(e.message[4].message[0])
        )
};
