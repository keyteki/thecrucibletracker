const {
  getAemberLost,
  getAemberStolen,
  getAemberCaptured,
  getTotalAemberGained,
  getAemberGainedFromPipsForPlayer,
  getAemberGainedFromReapForPlayer,
} = require('./aember');

const {
  getKeysForPlayer,
} = require('./keys');

const {
  getCardTypePlayedForPlayer,
  getCardsDiscardedForPlayer,
} = require('./cards');

const {
  getTurnsPerHouseForPlayer,
} = require('./house');

const {
  getChainsGained,
  getStartingChains,
} = require('./chains');

const checkMulligan = (player, events) => {
  let firstTurnIndex = 0;
  while (firstTurnIndex < events.length) {
    const event = events[firstTurnIndex];
    if (event.message && event.message.alert && event.message.alert.type === 'endofround' && event.message.alert.message[0] && /End of turn/.test(event.message.alert.message[0])) {
      break;
    }

    firstTurnIndex += 1;
  }

  const pregameEvents = events.slice(0, firstTurnIndex);
  const shuffles = pregameEvents.filter((event) => event.message && event.message[0] && event.message[0].name && event.message[0].name === player && event.message[1] && / is shuffling their deck/.test(event.message[1])).length;

  return shuffles > 1;
};

const getTurns = (events) => {
  let turns = 1;
  events.forEach((e) => {
    if (e.message && e.message.alert && e.message.alert.type === 'startofround' && e.message.alert.message[0] && /Turn/.test(e.message.alert.message[0])) {
      turns += 0.5;
    }
  });

  return Math.ceil(turns);
};

const createGameSummary = (events) => {
  let playerA;
  let playerB;

  for (let i = 0; i < events.length; i++) {
    if (Array.isArray(events[i].message) && events[i].message[2] && events[i].message[2].link) {
      playerA = events[i].message[0].name;
      playerB = events[i + 1].message[0].name;
      break;
    }
  }

  const playerADeckEvent = events.find((e) => (
    e.message && (
      e.message[1] === ' brings '
      || e.message[1].includes('playing as')
    ) && e.message[2].link && e.message[2].link.indexOf('undefined') === -1
  ));
  const playerADeckID = playerADeckEvent.message[2].link.replace('https://www.keyforgegame.com/deck-details/', '');
  const playerADeckName = playerADeckEvent.message[2].label;

  const playerBDeckEvent = events.find((e) => (
    e.message && (
      e.message[1] === ' brings '
      || e.message[1].includes('playing as')
    ) && e.message[2].link && e.message[2].link.indexOf('undefined') === -1 && e !== playerADeckEvent
  ));
  const playerBDeckID = playerBDeckEvent.message[2].link.replace('https://www.keyforgegame.com/deck-details/', '');
  const playerBDeckName = playerBDeckEvent.message[2].label;

  const winnerName = events.find((e) => {
    if (e.message && e.message.alert && /won the game/.test(e.message.alert.message[1])) {
      return e;
    }
  }).message.alert.message[0].name;

  let loserName;
  let loserDeckID;
  let loserDeckName;
  let winnerDeckID;
  let winnerDeckName;

  if (winnerName === playerA) {
    winnerDeckID = playerADeckID;
    winnerDeckName = playerADeckName;
    loserName = playerB;
    loserDeckID = playerBDeckID;
    loserDeckName = playerBDeckName;
  } else {
    winnerDeckID = playerBDeckID;
    winnerDeckName = playerBDeckName;
    loserName = playerA;
    loserDeckID = playerADeckID;
    loserDeckName = playerADeckName;
  }

  const winner = {
    name: winnerName,
    deckID: winnerDeckID,
    deckName: winnerDeckName,
    cardsDrawn: -1, // getCardsDrawnForPlayer(winnerName, events),
    cardsArchived: -1,
    cardsDiscarded: getCardsDiscardedForPlayer(winnerName, events),
    artifactsPlayed: getCardTypePlayedForPlayer(winnerName, 'artifact', events),
    creaturesPlayed: getCardTypePlayedForPlayer(winnerName, 'creature', events),
    actionsPlayed: getCardTypePlayedForPlayer(winnerName, 'action', events),
    upgradesPlayed: getCardTypePlayedForPlayer(winnerName, 'upgrade', events),
    aemberGainedFromCardPips: getAemberGainedFromPipsForPlayer(winnerName, events),
    aemberGainedFromReaping: getAemberGainedFromReapForPlayer(winnerName, events),
    aemberGainedFromStealing: getAemberStolen(winnerName, events),
    aemberGainedFromEffects: -1, // from cards like Warchest, trubaru
    aemberCaptured: getAemberCaptured(winnerName, events),
    aemberLost: getAemberLost(winnerName, events),
    aemberTotalGained: getTotalAemberGained(winnerName, events),
    didMulligan: checkMulligan(winnerName, events),
    chainsStarting: getStartingChains(winnerName, events),
    chainsGained: getChainsGained(winnerName, events),
    keys: getKeysForPlayer(winnerName, events),
  };
  Object.assign(winner, getTurnsPerHouseForPlayer(winnerName, events));

  const loser = {
    name: loserName,
    deckID: loserDeckID,
    deckName: loserDeckName,
    cardsDrawn: -1, // getCardsDrawnForPlayer(loserName, events),
    cardsArchived: -1,
    cardsDiscarded: getCardsDiscardedForPlayer(loserName, events),
    artifactsPlayed: getCardTypePlayedForPlayer(loserName, 'artifact', events),
    creaturesPlayed: getCardTypePlayedForPlayer(loserName, 'creature', events),
    actionsPlayed: getCardTypePlayedForPlayer(loserName, 'action', events),
    upgradesPlayed: getCardTypePlayedForPlayer(loserName, 'upgrade', events),
    aemberGainedFromCardPips: getAemberGainedFromPipsForPlayer(loserName, events),
    aemberGainedFromReaping: getAemberGainedFromReapForPlayer(loserName, events),
    aemberGainedFromStealing: getAemberStolen(loserName, events),
    aemberGainedFromEffects: -1, // from cards like Warchest, trubaru
    aemberCaptured: getAemberCaptured(loserName, events),
    aemberLost: getAemberLost(loserName, events),
    aemberTotalGained: getTotalAemberGained(loserName, events),
    didMulligan: checkMulligan(loserName, events),
    chainsStarting: getStartingChains(loserName, events),
    chainsGained: getChainsGained(loserName, events),
    keys: getKeysForPlayer(loserName, events),
  };
  Object.assign(loser, getTurnsPerHouseForPlayer(loserName, events));

  const turns = getTurns(events);

  return {
    winner,
    loser,
    turns,
  };
};

module.exports = createGameSummary;
