module.exports = {
    id: 'forge-a-key-with-imperial-forge',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Imperial Forge' &&
                /to/.test(e.message[3]) &&
                e.message[4] &&
                e.message[4].message &&
                /forge a key/.test(e.message[4].message[0])
        )
};
