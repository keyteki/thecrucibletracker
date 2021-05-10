module.exports = {
    id: 'destroy-cards-with-the-big-one',
    check: ({ player, game, summary, events }) => {
        const playEvent = events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / plays /.test(e.message[1]) &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'The Big One'
        );

        const destroyEvent = events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].argType === 'card' &&
                e.message[0].name === 'The Big One' &&
                /destroys all creatures/.test(e.message[1])
        );

        return !!playEvent && !!destroyEvent;
    }
};

// https://www.thecrucibletracker.com/games/534c2fa0-42e4-11ea-89c3-4d4b36eff106
// {
// "date": "2020-01-29T22:32:18.499Z",
// "message": [
// {
// "name": "The Big One",
// "image": "the-big-one",
// "label": "The Big One",
// "type": "artifact",
// "cardPrintedAmber": 1,
// "argType": "card"
// },
// " has 10 fuse counters and destroys all creatures and artifacts"
// ]
// },
