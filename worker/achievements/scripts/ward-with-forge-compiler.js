const toGameLog = require('../utils/toGameLog');

module.exports = {
  id: 'ward-with-forge-compiler',
  check: ({
    player,
    events,
  }) => {
    const regex = new RegExp(`${player} uses Forge Compiler to .* ward .*`);
    return !!toGameLog(events).find((line) => regex.test(line));
  }
};

// {
// "date": "2020-08-21T10:20:55.839Z",
// "message": [
// {
// "name": "nihil2501",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "Forge Compiler",
// "image": "forge-compiler",
// "label": "Forge Compiler",
// "type": "artifact",
// "cardPrintedAmber": 0,
// "enhancements": [
// "damage"
// ],
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "destroy ",
// {
// "name": "Forge Compiler",
// "image": "forge-compiler",
// "label": "Forge Compiler",
// "type": "artifact",
// "cardPrintedAmber": 0,
// "enhancements": [
// "damage"
// ],
// "argType": "card"
// },
// " and ward each friendly creature"
// ]
// }
// ]
// },
