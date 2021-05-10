module.exports = {
    id: 'reap-with-tezmal-three-times',
    check: ({ player, game, summary, events }) => {
        let reaps = 0;

        for (let i = 0; i < events.length; i++) {
            const e = events[i];

            if (
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                / to /.test(e.message[3]) &&
                e.message[4] &&
                Array.isArray(e.message[4].message) &&
                /reap with/.test(e.message[4].message[0]) &&
                e.message[4].message[1] &&
                e.message[4].message[1].message &&
                e.message[4].message[1].message[0] &&
                e.message[4].message[1].message[0].name === 'Tezmal'
            ) {
                reaps += 1;
            }

            if (reaps >= 3) {
                return true;
            }

            if (e.message && e.message.alert && e.message.alert.type === 'endofround') {
                reaps = 0;
            }
        }

        return reaps >= 3;
    }
};

// https://www.thecrucibletracker.com/games/e4309f90-5a65-11ea-a293-919cc2ac4874
// {
// "date": "2020-02-28T20:12:41.229Z",
// "message": [
// {
// "name": "RectangleCactus",
// "argType": "nonAvatarPlayer"
// },
// " uses ",
// {
// "name": "Tezmal",
// "image": "tezmal",
// "label": "Tezmal",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "reap with ",
// {
// "message": [
// {
// "name": "Tezmal",
// "image": "tezmal",
// "label": "Tezmal",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// }
// ]
// }
// ]
// }
// ]
// },
