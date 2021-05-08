const isEndOfTurn = (event) => event.message
      && event.message.alert
      && event.message.alert.type === 'endofround';

const isCardPlay = (event, player) => Array.isArray(event.message)
        && event.message[0].name === player
        && / plays /.test(event.message[1])
        && event.message[2]
        && event.message[2].argType === 'card';

const isLibraryCardPlay = (event, player) => Array.isArray(event.message)
        && event.message[0].name === player
        && / uses /.test(event.message[1])
        && event.message[2]
        && event.message[2].argType === 'card'
        && event.message[2].name === 'Library Card';

module.exports = {
  id: 'library-card-10-cards',
  check: ({
    player,
    game,
    summary,
    events,
  }) => {
    let playedCard = false;
    let countForTurn = 0;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (isEndOfTurn(event)) {
        return countForTurn >= 10;
      }
      if (isLibraryCardPlay(event, player)) {
        playedCard = true;
      }
      if (playedCard && isCardPlay(event, player)) {
        countForTurn += 1;
      }
    }
  }
};
