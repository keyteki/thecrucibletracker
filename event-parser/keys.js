const getKeysForPlayer = (player, events) => {
  const update = [].concat(events).reverse().find((e) => e.type === 'PLAYER_STATE_UPDATE');

  if (update) {
    if (typeof update.players[player].keys === 'object') {
      return Object.values(update.players[player].keys).filter((v) => v).length;
    }
    return update.players[player].keys;
  }

  return -1;
};

module.exports = {
  getKeysForPlayer,
};
