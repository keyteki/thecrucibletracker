import { uniqBy } from 'lodash';

const apiPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '/api';

const fetchForUser = (user, deckID) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let pathGames = `${apiPath}/users/${user}/games`;
  let pathGameSummaries = `${apiPath}/users/${user}/game-summaries`;
  let pathGameTimelines = `${apiPath}/users/${user}/game-timelines`;

  if (deckID) {
    pathGames = `${apiPath}/users/${user}/decks/${deckID}/games`;
    pathGameSummaries = `${apiPath}/users/${user}/decks/${deckID}/game-summaries`;
    pathGameTimelines = `${apiPath}/users/${user}/decks/${deckID}/game-timelines`;
  }

  return Promise.all([
    fetch(pathGames).then((response) => response.json()),
    fetch(pathGameSummaries).then((response) => response.json()),
    fetch(pathGameTimelines).then((response) => response.json()),
  ])
    .then((values) => {
      let games = values[0];
      let gameSummaries = values[1];
      let gameTimelines = values[2];

      if (deckID) {
        games = games.filter((g) => (g.winner === user && g.winner_deck_id === deckID) || (g.loser === user && g.loser_deck_id === deckID));
      }

      const toUnix = (date) => (new Date(date).getTime()) / 1000;

      games = uniqBy(games, (game) => {
        if (game.crucible_game_id) return game.crucible_game_id;
        return game.id;
      });

      games = games.filter((game) => game.winner !== game.loser);
      games = games.filter((game) => game.turns > 2);
      games = games.sort((a, b) => toUnix(b.date) - toUnix(a.date));

      gameSummaries = gameSummaries.filter((summary) => games.find((game) => game.id === summary.game_id));

      gameTimelines = gameTimelines.filter((timeline) => games.find((game) => game.id === timeline.game_id));

      // A bug leaves us with duplicate summaries and timelines. Is there duplicate 'events'?
      gameSummaries = uniqBy(gameSummaries, 'game_id');
      gameTimelines = uniqBy(gameTimelines, 'game_id');

      return {
        games,
        gameSummaries,
        gameTimelines,
      };
    });
};

const fetchGamesAndSummariesForUser = (user, deckID) => {
  let pathGames = `${apiPath}/users/${user}/games`;
  let pathGameSummaries = `${apiPath}/users/${user}/game-summaries`;

  if (deckID) {
    pathGames = `${apiPath}/users/${user}/decks/${deckID}/games`;
    pathGameSummaries = `${apiPath}/users/${user}/decks/${deckID}/game-summaries`;
  }

  return Promise.all([
    fetch(pathGames).then((response) => response.json()),
    fetch(pathGameSummaries).then((response) => response.json()),
  ])
    .then((values) => {
      let games = values[0];
      let gameSummaries = values[1];

      if (deckID) {
        games = games.filter((g) => (g.winner === user && g.winner_deck_id === deckID) || (g.loser === user && g.loser_deck_id === deckID));
      }

      const toUnix = (date) => (new Date(date).getTime()) / 1000;

      games = uniqBy(games, (game) => {
        if (game.crucible_game_id) return game.crucible_game_id;
        return game.id;
      });

      games = games.filter((game) => game.winner !== game.loser);
      games = games.filter((game) => game.turns > 2);
      games = games.sort((a, b) => toUnix(b.date) - toUnix(a.date));

      gameSummaries = gameSummaries.filter((summary) => games.find((game) => game.id === summary.game_id));

      gameSummaries = uniqBy(gameSummaries, 'game_id');

      return {
        games,
        gameSummaries,
      };
    });
};

export {
  fetchForUser,
  fetchGamesAndSummariesForUser,
};
