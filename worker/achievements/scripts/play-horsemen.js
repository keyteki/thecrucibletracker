module.exports = {
    id: 'play-horsemen',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / plays /.test(e.message[1]) &&
                e.message[2].argType === 'card' &&
                [
                    'Horseman of Pestilence',
                    'Horseman of War',
                    'Horseman of Famine',
                    'Horseman of Death'
                ].includes(e.message[2].name)
        )
};
