module.exports = {
    id: 'sacrifice-10-creatures-with-obsidian-forge',
    check: ({ player, game, summary, events }) =>
        !!events.find(
            (e) =>
                Array.isArray(e.message) &&
                e.message[0].name === player &&
                / uses /.test(e.message[1]) &&
                e.message[2] &&
                e.message[2].argType === 'card' &&
                e.message[2].name === 'Obsidian Forge' &&
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

// {
// "date": "2020-02-15T08:41:48.576Z",
// "message": [
// {
// "name": "stronglink",
// "argType": "nonAvatarPlayer"
// },
// " uses ",
// {
// "name": "Obsidian Forge",
// "image": "obsidian-forge",
// "label": "Obsidian Forge",
// "type": "artifact",
// "cardPrintedAmber": 1,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "sacrifice ",
// {
// "message": [
// {
// "name": "EDAI “Edie” 4x4",
// "image": "edai-edie-4x4",
// "label": "EDAI “Edie” 4x4",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Infurnace",
// "image": "infurnace",
// "label": "Infurnace",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Malison",
// "image": "malison",
// "label": "Malison",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "EDAI “Edie” 4x4",
// "image": "edai-edie-4x4",
// "label": "EDAI “Edie” 4x4",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Reassembling Automaton",
// "image": "reassembling-automaton",
// "label": "Reassembling Automaton",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Quant",
// "image": "quant",
// "label": "Quant",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Harbinger of Doom",
// "image": "harbinger-of-doom",
// "label": "Harbinger of Doom",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", and ",
// {
// "name": "Etaromme",
// "image": "etaromme",
// "label": "Etaromme",
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

// Uses Obsidian Forge to sacrifice EDAI “Edie” 4x4, Infurnace, Malison, EDAI “Edie” 4x4, Reassembling Automaton, Quant, Harbinger of Doom, and Etaromme

// https://www.thecrucibletracker.com/games/34eae240-4fcd-11ea-8266-c5647fe95b7f
