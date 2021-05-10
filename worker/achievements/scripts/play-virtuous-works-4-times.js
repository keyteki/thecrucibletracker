module.exports = {
    id: 'play-virtuous-works-4-times',
    check: ({ player, game, summary, events }) => {
        let plays = 0;

        events.forEach((e) => {
            if (
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / plays /.test(e.message[1]) &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Virtuous Works'
            ) {
                plays += 1;
            }
        });

        return plays >= 4;
    }
};
