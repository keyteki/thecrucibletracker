const isEndOfTurn = (event) => event.message
      && event.message.alert
      && event.message.alert.type === 'endofround';

const isLethologicaPlay = (event, player) => Array.isArray(event.message)
        && event.message[0].name === player
        && / uses /.test(event.message[1])
        && event.message[2]
        && event.message[2].argType === 'card'
        && event.message[2].name === 'Lethologica';

module.exports = {
  id: 'play-lethologica-3-times',
  check: ({
    player,
    game,
    summary,
    events,
  }) => {
    let countForTurn = 0;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (isEndOfTurn(event)) {
        countForTurn = 0;
      }
      if (isLethologicaPlay(event, player)) {
        countForTurn += 1;
      }
      if (countForTurn >= 3) {
        return true;
      }
    }
  }
};

// {
// "id": "73e59d36-3719-11eb-b916-0fa15806b9ce",
// "date": "2020-12-05T16:46:42.307Z",
// "message": {
// "alert": {
// "type": "endofround",
// "message": [
// "End of turn 1"
// ]
// }
// },
// "activePlayer": "AlexShepelev"
// },
