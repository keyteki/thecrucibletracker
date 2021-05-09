const { findLastIndex } = require('lodash');

// {
// "date": "2019-05-02T21:45:04.764Z",
// "message": [
// {
// "name": "stronglink",
// "argType": "nonAvatarPlayer"
// },
// "'s chains are reduced by 1 to ",
// 1
// ]
// },

const getChainsGained = (player, events) => {
    const chainReducedEvents = events.filter(
        (event) =>
            Array.isArray(event.message) &&
            event.message[0].name === player &&
            /s chains are reduced by 1 to /.test(event.message[1])
    );

    let chainsGained = 0;
    let lastChainAmount = 0;
    chainReducedEvents.forEach((event) => {
        const currentChainAmount = event.message[2];
        if (currentChainAmount >= lastChainAmount) {
            chainsGained += currentChainAmount - lastChainAmount + 1;
        }

        lastChainAmount = currentChainAmount;
    });

    return chainsGained - getStartingChains(player, events);
};

// {
// "date": "2019-05-03T19:27:23.253Z",
// "message": {
// "alert": {
// "type": "danger",
// "message": [
// {
// "name": "stronglink",
// "argType": "nonAvatarPlayer"
// },
// " sets ",
// "chains",
// " to ",
// 4,
// " (",
// "+1",
// ")"
// ]
// }
// }
// },
const getStartingChains = (player, events) => {
    const endOfTurn1Index = findLastIndex(
        events,
        (event) =>
            event.message &&
            event.message.alert &&
            Array.isArray(event.message.alert.message) &&
            event.message.alert.message[0] === 'End of turn 1'
    );

    const firstChainReduction = events
        .slice(0, endOfTurn1Index)
        .find(
            (event) =>
                Array.isArray(event.message) &&
                event.message[0].name === player &&
                /s chains are reduced by 1 to /.test(event.message[1])
        );

    if (firstChainReduction) {
        return firstChainReduction.message[2] + 1; // started with one more than that number
    }
    return 0;
};

module.exports = {
    getChainsGained,
    getStartingChains
};
