const cardNameReplacementRegex = /[^\d\w\s]/g;
const spaceRegex = /\s/g;
const stripSpecialCharacters = (name) => name.replace(cardNameReplacementRegex, '');
const cardNameToCardNameKey = (name) => name.replace(cardNameReplacementRegex, '')
  .replace(spaceRegex, '-')
  .toLowerCase();

const getCards = async (dbPool) => {
  const query = 'SELECT DISTINCT card FROM card_plays';

  const client = await dbPool.connect();
  const response = await client.query(query);
  await client.release();

  return response.rows.map((r) => r.card);
};

const getTop10PlaysForCard = async (dbPool, card) => {
  const query = 'SELECT player, count FROM card_plays WHERE card=$1 ORDER BY count DESC LIMIT 10';

  const client = await dbPool.connect();
  const response = await client.query(query, [ card, ]);
  await client.release();
  return response.rows;
};

const main = async (dbPool) => {
  console.log('[card-leaderboard] Start');

  const CotACards = require('../expansions/CotA');
  const AoACards = require('../expansions/AoA');
  const WCCards = require('../expansions/WC');
  const MMCards = require('../expansions/MM');
  const DTCards = require('../expansions/DT');

  const leaderboard = {
    topPlays: {},
  };

  const cards = await getCards(dbPool);

  for (let i = 0; i < cards.length; i += 1) {
    const card = cards[i];

    let ffgData = DTCards.cards.find((data) => data.id === cardNameToCardNameKey(card) || stripSpecialCharacters(data.name) === stripSpecialCharacters(card));
    ffgData = ffgData || MMCards.cards.find((data) => data.id === cardNameToCardNameKey(card) || stripSpecialCharacters(data.name) === stripSpecialCharacters(card));
    ffgData = ffgData || WCCards.cards.find((data) => data.id === cardNameToCardNameKey(card) || data.name === card);
    ffgData = ffgData || AoACards.cards.find((data) => data.id === cardNameToCardNameKey(card) || data.name === card);
    ffgData = ffgData || CotACards.cards.find((data) => data.id === cardNameToCardNameKey(card) || data.name === card);

    if (!ffgData) {
      console.log('[card-leaderboard] data not found for ', card, cardNameToCardNameKey(card));
      return;
    }

    const cardData = {
      order: parseInt(ffgData.number, 10),
      topPlayers: await getTop10PlaysForCard(dbPool, card),
    };

    if (!cardData.order) {
      cardData.order = parseInt(ffgData.number.replace('A', ''), 10) * -1;
    }

    leaderboard.topPlays[ffgData.id] = cardData;
  }

  const query = 'INSERT INTO card_play_leaderboard VALUES (DEFAULT, $1, $2)';

  const client = await dbPool.connect();
  const date = new Date().toISOString();
  await client.query(query, [ JSON.stringify(leaderboard), date ]);
  await client.release();
  console.log('[card-leaderboard] Done');
};

module.exports = main;
