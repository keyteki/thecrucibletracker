const getCardTypePlayedForPlayer = (player, cardType, events) =>
    events.filter(
        (e) =>
            Array.isArray(e.message) &&
            e.message[0].name === player &&
            / plays /.test(e.message[1]) &&
            e.message[2].argType === 'card' &&
            e.message[2].type === cardType
    ).length;

const getCardsDrawnForPlayer = (player, events) => {
    let checks = 0;
    events.forEach((e) => {
        if (
            Array.isArray(e.message) &&
            e.message[0].name === player &&
            /^ draws $/.test(e.message[1])
        ) {
            checks += e.message[2];
        }
    });
    events.forEach((e) => {
        if (
            Array.isArray(e.message) &&
            e.message[0].name === player &&
            /^ draws a card due to $/.test(e.message[1])
        ) {
            checks += 1;
        }
    });
    // doc bookton
    // battle fleet
    // sound the horns
    // arise
    // help from future self
    // neuro syphon
    // library of babble
    // library access
    // brain eater
    // quioxo the adventurer
    // replicator
    // time traveller
    // invasion portal
    // duma the martyr
    // fagyin
    // mimicry
    // regrowth
    // bear flute
    // troop recall
    // nepenthe seed
    // spectral tunneler
    return checks;
};

const getCardsDiscardedForPlayer = (player, events) => {
    const discardCardEvents = events.filter(
        (event) =>
            Array.isArray(event.message) &&
            event.message[0].name === player &&
            event.message[1] === ' discards '
    );

    return discardCardEvents.length;
};

module.exports = {
    getCardTypePlayedForPlayer,
    getCardsDiscardedForPlayer
};
