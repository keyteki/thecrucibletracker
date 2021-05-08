module.exports = {
  id: 'using-at-most-2-houses-forge-3-keys-in-a-game',
  check: ({
    player,
    game,
    summary,
    events,
  }) => {
    if (player !== game.winner) return false;

    let uniqueHouseCalls = 0;
    [
      'turnsDis',
      'turnsShadows',
      'turnsBrobnar',
      'turnsMars',
      'turnsUntamed',
      'turnsLogos',
      'turnsSanctum',
      'turnsStarAlliance',
      'turnsSaurian',
    ].forEach((key) => {
      if (summary.winner[key] >= 1) {
        uniqueHouseCalls += 1;
      }
    });

    return uniqueHouseCalls <= 2;
  },
};
