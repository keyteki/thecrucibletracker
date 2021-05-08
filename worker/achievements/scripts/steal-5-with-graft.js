const toGameLog = require('../utils/toGameLog');

module.exports = {
  id: 'steal-5-with-graft',
  check: ({
    player,
    events,
  }) => !!toGameLog(events).find((line) => {
    const regex = new RegExp(`${player} uses Interdimensional Graft to transfer.*`);
    if (regex.test(line)) {
      const amount = Number.parseInt(
        line
          .replace(`${player} uses Interdimensional Graft to transfer `, '')
          .replace(' amber from ', ''),
        10
      );
      return amount >= 5;
    }
  })
};

// {
// "id": "57bbb990-371a-11eb-913f-db493a8d782b",
// "date": "2020-12-05T16:53:04.553Z",
// "message": [
// {
// "name": "Jkhops21",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "Interdimensional Graft",
// "image": "interdimensional-graft",
// "label": "Interdimensional Graft",
// "type": "action",
// "cardPrintedAmber": 1,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "transfer 4 amber from ",
// {
// "message": [
// {
// "name": "agrandstudent",
// "argType": "nonAvatarPlayer",
// "role": "user"
// }
// ]
// }
// ]
// }
// ],
// "activePlayer": "agrandstudent"
// },
