module.exports = {
  id: 'steal-with-bo-nithing',
  check: ({
    player,
    game,
    summary,
    events,
  }) => !!events.find((e) => Array.isArray(e.message)
        && e.message[0].name === player
        && / uses /.test(e.message[1])
        && e.message[2]
        && e.message[2].argType === 'card'
        && [ 'Bo Nithing' ].includes(e.message[2].name)
        && e.message[3] === ' to '
        && e.message[4].message
        && e.message[4].message[0] === 'steal 2 amber from ')
};

// {
// "id": "034bdc45-371b-11eb-b916-0fa15806b9ce",
// "date": "2020-12-05T16:57:52.388Z",
// "message": [
// {
// "name": "Vassily85",
// "argType": "nonAvatarPlayer",
// "role": "user"
// },
// " uses ",
// {
// "name": "Bo Nithing",
// "image": "bo-nithing",
// "label": "Bo Nithing",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "steal 2 amber from ",
// {
// "message": [
// {
// "name": "GhostHawk1972",
// "argType": "nonAvatarPlayer",
// "role": "supporter"
// }
// ]
// }
// ]
// }
// ],
// "activePlayer": "Vassily85"
// },
