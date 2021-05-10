const toGameLog = require('../utils/toGameLog');

module.exports = {
    id: 'steal-with-borrow',
    check: ({ player, events }) => {
        const regex = new RegExp(`${player} uses "Borrow" to take control of.*`);
        return !!toGameLog(events).find((line) => regex.test(line));
    }
};

// {
// "date": "2020-08-21T11:10:16.215Z",
// "message": [
// {
// "name": "jfkziegler",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "\"Borrow\"",
// "image": "borrow",
// "label": "\"Borrow\"",
// "type": "action",
// "cardPrintedAmber": 1,
// "enhancements": [
// "capture"
// ],
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "take control of ",
// {
// "name": "Font of the Eye",
// "image": "font-of-the-eye",
// "label": "Font of the Eye",
// "type": "artifact",
// "cardPrintedAmber": 0,
// "argType": "card"
// }
// ]
// }
// ]
// },
