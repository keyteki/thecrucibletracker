module.exports = {
    id: 'exile-narp',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Exile' &&
                / to /.test(e.message[3]) &&
                e.message[4] &&
                e.message[4].message &&
                /give control of/.test(e.message[4].message[0]) &&
                e.message[4].message[1] &&
                e.message[4].message[1].argType === 'card' &&
                e.message[4].message[1].name === 'Narp'
        )
};
