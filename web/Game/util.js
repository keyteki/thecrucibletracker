export const stripNameFromLine = (game, lines) => {
  if (!Array.isArray(lines)) lines = [ lines ];

  const output = lines.map((line) => {
    const indexOfWinner = line.indexOf(game.winner) === -1 ? Infinity : line.indexOf(game.winner);
    const indexOfLoser = line.indexOf(game.loser) === -1 ? Infinity : line.indexOf(game.loser);
    if (indexOfWinner > indexOfLoser) {
      line = line.replace(`${game.loser} `, '');
    } else {
      line = line.replace(`${game.winner} `, '');
    }

    line = line.replace(/''/g, "'");

    const toCapitalize = [
      'uses',
      'sets',
      'heals',
      'plays',
      'doesn\'t',
      'draws',
      'gains',
      'declares',
      'moves',
      'exhausts',
      'takes',
      'adds',
      'played',
      'discards',
      'chooses',
    ];
    toCapitalize.forEach((word) => {
      if (line.slice(0, word.length) === word) {
        line = line[0].toUpperCase() + line.slice(1);
      }
    });
    return line;
  });

  if (output.length === 1) return output[0];
  return output;
};
