module.exports = {
    id: 'play-kelifi-dragon',
    check: ({ player, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / plays /.test(e.message[1]) &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Kelifi Dragon'
        )
};
