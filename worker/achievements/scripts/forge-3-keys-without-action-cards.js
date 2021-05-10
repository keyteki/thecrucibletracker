module.exports = {
    id: 'forge-3-keys-without-playing-action-cards',
    check: ({ player, game, summary, events }) => {
        if (player !== game.winner) return false;

        return (
            events.find(
                (e) =>
                    Array.isArray(e.message) &&
                    e.message[0].name === player &&
                    / plays /.test(e.message[1]) &&
                    e.message[2].argType === 'card' &&
                    e.message[2].type === 'action'
            ) === undefined
        );
    }
};
