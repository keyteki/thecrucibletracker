module.exports = {
  id: 'use-a-fair-game-to-gain-4-amber',
  check: ({
    player,
    game,
    summary,
    events,
  }) => !!events.find((e) => {
    const isEvent = Array.isArray(e.message)
        && e.message[0].name === player
        && / uses /.test(e.message[1])
        && e.message[2]
        && e.message[2].argType === 'card'
        && e.message[2].name === 'A Fair Game'
        && / to /.test(e.message[3])
        && e.message[4]
        && e.message[4].message
        && /discard/.test(e.message[4].message[0]);

    if (!isEvent) {
      return false;
    }

    const isFirst = e.message[4].message[1].name === player;

    if (!isFirst) {
      return e.message[4].message[7] >= 4;
    }
    return e.message[4].message[17] >= 4;
  })
};

// {
// "date": "2020-01-30T09:43:56.930Z",
// "message": [
// {
// "name": "Matze51",
// "argType": "nonAvatarPlayer"
// },
// " uses ",
// {
// "name": "A Fair Game",
// "image": "a-fair-game",
// "label": "A Fair Game",
// "type": "action",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " to ",
// {
// "message": [
// "discard the top card of ",
// {
// "name": "grandtear",
// "argType": "nonAvatarPlayer"
// },
// "''s deck:",
// {
// "name": "Uxlyx the Zookeeper",
// "image": "uxlyx-the-zookeeper",
// "label": "Uxlyx the Zookeeper",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " and reveal their hand: ",
// {
// "message": [
// {
// "name": "Brammo",
// "image": "brammo",
// "label": "Brammo",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Golden Aura",
// "image": "golden-aura",
// "label": "Golden Aura",
// "type": "action",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Aubade the Grim",
// "image": "aubade-the-grim",
// "label": "Aubade the Grim",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Golden Aura",
// "image": "golden-aura",
// "label": "Golden Aura",
// "type": "action",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", ",
// {
// "name": "Burn the Stockpile",
// "image": "burn-the-stockpile",
// "label": "Burn the Stockpile",
// "type": "action",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// ", and ",
// {
// "name": "Maruck the Marked",
// "image": "maruck-the-marked",
// "label": "Maruck the Marked",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// }
// ]
// },
// ", gaining ",
// 0,
// " amber. Then ",
// {
// "name": "grandtear",
// "argType": "nonAvatarPlayer"
// },
// " discards the top card of ",
// {
// "name": "Matze51",
// "argType": "nonAvatarPlayer"
// },
// "''s deck: ",
// {
// "name": "Tyxl Beambuckler",
// "image": "tyxl-beambuckler",
// "label": "Tyxl Beambuckler",
// "type": "creature",
// "cardPrintedAmber": 0,
// "argType": "card"
// },
// " and reveals their hand:",
// {
// "message": [
// {
// "name": "Phloxem Spike",
// "image": "phloxem-spike",
// "label": "Phloxem Spike",
// "type": "action",
// "cardPrintedAmber": 1,
// "argType": "card"
// },
// " and ",
// {
// "name": "Martian Hounds",
// "image": "martian-hounds",
// "label": "Martian Hounds",
// "type": "action",
// "cardPrintedAmber": 0,
// "argType": "card"
// }
// ]
// },
// ", gaining ",
// 2,
// " amber"
// ]
// }
// ]

// Uses A Fair Game to discard the top card of Panapenao''s deck:Into the Night and reveal their hand: Yantzee Gang, Subtle Chain, Binding Irons, Spike Trap, EDAI “Edie” 4x4, Treasure Map, Dr. Milli, Lilithal, and Buzzle, gaining 4 amber. Then Panapenao discards the top card of MrAwesomePossum''s deck: Twin Bolt Emission and reveals their hand:Brain Eater, Seeker Needle, and Bad Penny, gaining 1 amber
