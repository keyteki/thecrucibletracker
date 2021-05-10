module.exports = {
    id: 'sacrifice-creatures-with-might-makes-right',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Might Makes Right' &&
                /to/.test(e.message[3]) &&
                e.message[4] &&
                e.message[4].message &&
                /sacrifice/.test(e.message[4].message[0]) &&
                e.message[4].message[1] &&
                e.message[4].message[1].message &&
                e.message[4].message[1].message.filter((obj) => typeof obj !== 'string').length >=
                    10
        )
};
