// The method of using PLAYER_STATE_UPDATE only works
// if all PLAYER_STATE_UPDATE events are present. If
// users refresh their page mid game PLAYER_STATE_UPDATE
// events will be missing.
const allPlayerStateUpdatesArePresent = (events) => {
    try {
        let firstAemberIndex = 0;
        let firstStateUpdateIndex = 0;

        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            if (Array.isArray(e.message) && /: \d+ amber .*: \d+ amber/.test(e.message[0])) {
                let line = e.message[0]
                    .replace(new RegExp(' \\(0 keys\\)'), '')
                    .replace(new RegExp(' \\(1 key\\)'), '')
                    .replace(new RegExp(' \\(2 keys\\)'), '')
                    .replace(new RegExp(' \\(3 keys\\)'), '');
                line = line
                    .replace(new RegExp(' \\(0 keys\\)'), '')
                    .replace(new RegExp(' \\(1 key\\)'), '')
                    .replace(new RegExp(' \\(2 keys\\)'), '')
                    .replace(new RegExp(' \\(3 keys\\)'), '');
                const matches = line.match(/(\w+): ([0-9]*) amber (\w+): ([0-9]*) amber/);
                const amountPlayerA = Number.parseInt(matches[2], 10);
                const amountPlayerB = Number.parseInt(matches[4], 10);
                if (amountPlayerA > 0 || amountPlayerB > 0) {
                    firstAemberIndex = i;
                    break;
                }
            }
        }
        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            if (e.type === 'PLAYER_STATE_UPDATE') {
                firstStateUpdateIndex = i;
                break;
            }
        }
        return firstStateUpdateIndex <= firstAemberIndex;
    } catch (e) {
        return false;
    }
};

const getTotalAemberGained = (player, events) => {
    if (!allPlayerStateUpdatesArePresent(events)) {
        return -1;
    }

    // TODO do we need to consider amount lost, stolen, and captured?
    let total = 0;
    let previousAmount = 0;

    events.forEach((e) => {
        if (e.type === 'PLAYER_STATE_UPDATE') {
            const amount = e.players[player].amber;
            if (amount > previousAmount) {
                total += amount - previousAmount;
            }
            previousAmount = amount;
        }
    });

    return total;
};

const getAemberLost = (player, events) => {
    // TODO screechbomb
    let amount = 0;

    events.forEach((e) => {
        const lostAember =
            Array.isArray(e.message) &&
            e.message[1] === ' uses ' &&
            e.message[4] &&
            e.message[4].message &&
            e.message[4].message[0] === 'make ' &&
            e.message[4].message[1] &&
            e.message[4].message[1].message &&
            e.message[4].message[1].message[0].name === player &&
            /lose [0-9]* amber/.test(e.message[4].message[2]);

        if (lostAember) {
            let text = e.message[4].message[2];
            text = text.replace(' lose ', '');
            text = text.replace(' amber', '');
            amount += Number.parseInt(text, 10);
        }
    });

    return amount;
};

const getAemberCaptured = (player, events) => {
    let amount = 0;

    events.forEach((e) => {
        const capturedAember =
            Array.isArray(e.message) &&
            e.message[1] === ' uses ' &&
            e.message[4] &&
            e.message[4].message &&
            /capture [0-9]* amber from /.test(e.message[4].message[0]) &&
            e.message[0].name === player;

        if (capturedAember) {
            let text = e.message[4].message[0];

            if (
                /^cause each undamaged creature to capture [0-9]* amber from their opponent$/.test(
                    text
                )
            ) {
                text = text.replace('cause each undamaged creature to capture ', '');
                text = text.replace(' amber from their opponent', '');
                amount += Number.parseInt(text, 10);
            } else if (/^capture [0-9]* amber from $/.test(text)) {
                text = text.replace('capture ', '');
                text = text.replace(' amber from ', '');
                amount += Number.parseInt(text, 10);
            } else {
                // console.log(text); TODO
            }

            if (isNaN(amount)) {
                console.log('nan amount 2', e.message[4].message[0]);
            }
        }
    });

    return amount;
};

const getAemberStolen = (player, events) => {
    let amount = 0;

    events.forEach((e) => {
        if (
            Array.isArray(e.message) &&
            e.message[1] === ' uses ' &&
            e.message[4] &&
            e.message[4].message &&
            /steal [0-9]* amber from /.test(e.message[4].message[0]) &&
            e.message[0].name === player
        ) {
            let text = e.message[4].message[0];
            text = text.replace('steal ', '');
            text = text.replace(' amber from ', '');
            amount += Number.parseInt(text, 10);

            if (isNaN(amount)) {
                console.log('nan amount', e.message[4].message[0]);
            }
        }

        if (
            Array.isArray(e.message) &&
            e.message[1] === ' uses ' &&
            e.message[4] &&
            e.message[4].message &&
            (/steal an amber from /.test(e.message[4].message[0]) ||
                /steal an additional amber/.test(e.message[4].message[0])) &&
            e.message[0].name === player
        ) {
            amount += 1;
        }
    });

    return amount;
};

const getAemberGainedFromPipsForPlayer = (player, events) => {
    const aemberPipsGainedEvents = events.filter(
        (event) =>
            Array.isArray(event.message) &&
            event.message[0].name === player &&
            /gaining.*amber/.test(event.message[3])
    );

    let aemberPipsGained = 0;
    aemberPipsGainedEvents.forEach((event) => {
        const pipAmount = event.message[3].match(/[0-9]+/)[0];
        aemberPipsGained += +pipAmount;
    });

    return aemberPipsGained;
};

// "message": [
//   {
//     "name": "Petitbot",
//     "argType": "nonAvatarPlayer"
//   },
//   " uses ",
//   {
//     "name": "\"John Smyth\"",
//     "image": "john-smyth",
//     "label": "\"John Smyth\"",
//     "type": "creature",
//     "argType": "card"
//   },
//   " to ",
//   {
//     "message": [
//       "reap with ",
//       {
//         "message": [
//           {
//             "name": "\"John Smyth\"",
//             "image": "john-smyth",
//             "label": "\"John Smyth\"",
//             "type": "creature",
//             "argType": "card"
//           }
//         ]
//       }
//     ]
//   }
// ]
//
// "message": [
//   {
//     "name": "Petitbot",
//     "argType": "nonAvatarPlayer"
//   },
//   " gains 1 amber due to ",
//   {
//     "name": "Crystal Hive",
//     "image": "crystal-hive",
//     "label": "Crystal Hive",
//     "type": "artifact",
//     "argType": "card"
//   },
//   "''s effect"
// ]

const getAemberGainedFromReapForPlayer = (player, events) => {
    let total = 0;

    const reapEvents = events.filter(
        (event) =>
            Array.isArray(event.message) &&
            event.message[0].name === player &&
            event.message[1] === ' uses ' &&
            event.message[2].type === 'creature' &&
            event.message[4] &&
            Array.isArray(event.message[4].message) &&
            event.message[4].message[0] === 'reap with '
    );

    total += reapEvents.length;

    const crystalHiveEvents = events.filter(
        (event) =>
            Array.isArray(event.message) &&
            event.message[0].name === player &&
            /^ gains [0-9]* amber due to $/.test(event.message[1]) &&
            event.message[2].name === 'Crystal Hive'
    );

    total += crystalHiveEvents.length;

    return total;
};

module.exports = {
    getAemberLost,
    getAemberStolen,
    getAemberCaptured,
    getTotalAemberGained,
    getAemberGainedFromPipsForPlayer,
    getAemberGainedFromReapForPlayer,
    allPlayerStateUpdatesArePresent
};
