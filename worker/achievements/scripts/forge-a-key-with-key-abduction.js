// Uses Key Charge to make MrAwesomePossum lose 1 amber
// Forges the red key, paying 6 amber
//
// Uses Chota Hazri to make SimosTest lose 1 amber
// Forges the red key, paying 9 amber
//
// Uses Key Abduction to return all mars creatures to their owner''s hand
// Forges the yellow key, paying 0 amber

module.exports = {
    id: 'forge-a-key-with-key-abduction',
    check: ({ player, game, summary, events }) => {
        let keyEventIndex = 0;
        let endOfRoundEventIndex = 0;

        const keyEvent = events.find((e, i) => {
            keyEventIndex = i;
            return (
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / plays /.test(e.message[1]) &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Key Abduction'
            );
        });

        if (!keyEvent) {
            return false;
        }

        const endOfRoundEvent = events.slice(keyEventIndex).find((e, i) => {
            endOfRoundEventIndex = keyEventIndex + i;
            return e.message && e.message.alert && e.message.alert.type === 'endofround';
        });

        if (!endOfRoundEvent) {
            endOfRoundEventIndex = events.length;
        }

        const forgeKeyEvent = events
            .slice(keyEventIndex, endOfRoundEventIndex)
            .find(
                (e, i) =>
                    Array.isArray(e.message) &&
                    e.message[0].name === player &&
                    (/forges a key, paying/.test(e.message[1]) ||
                        /forgedkeyred/.test(e.message[2]) ||
                        /forgedkeyyellow/.test(e.message[2]) ||
                        /forgedkeyblue/.test(e.message[2]))
            );

        return !!forgeKeyEvent;
    }
};
