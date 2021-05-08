import React, { Component, } from 'react';
import { uniqBy } from 'lodash';
import Table from './table';
import ContainerFull from '../Components/ContainerFull';
import constants from '../constants';

const { api } = constants;

const fetchForUser = (user, deckID) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const pathGames = `${api.endpoint}/users/${user}/decks/${deckID}/games`;
  const pathGameSummaries = `${api.endpoint}/users/${user}/decks/${deckID}/game-summaries`;

  return Promise.all([
    fetch(pathGames).then((response) => response.json()),
    fetch(pathGameSummaries).then((response) => response.json()),
  ])
    .then(async (values) => {
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

      // A bug leaves us with duplicate summaries and timelines. Is there duplicate 'events'?
      gameSummaries = uniqBy(gameSummaries, 'game_id');

      const deckUUIDMap = {};
      games.forEach(({ winner_deck_id, loser_deck_id }) => {
        deckUUIDMap[winner_deck_id] = true;
        deckUUIDMap[loser_deck_id] = true;
      });
      const deckUUIDs = Object.keys(deckUUIDMap);

      return {
        games,
        gameSummaries,
      };
    });
};

class GamesScreen extends Component {
  constructor() {
    super();
    this.state = {
      games: [],
      gameSummaries: [],
      awards: [],
    };
  }

  componentDidMount(prevProps, prevState, snapshot) {
    if (!this.props.user) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      Promise.all([
        fetch(`/api/decks/${this.props.deckID}/games`).then((response) => response.json()),
      ]).then((values) => {
        const toUnix = (date) => (new Date(date).getTime()) / 1000;

        let games = values[0];
        games = uniqBy(games, (game) => {
          if (game.crucible_game_id) return game.crucible_game_id;
          return game.id;
        });
        games = games.sort((a, b) => toUnix(b.date) - toUnix(a.date));
        this.setState({
          games,
        });
      });
      return;
    }

    fetchForUser(this.props.user, this.props.deckID)
      .then(({ games, gameSummaries }) => {
        this.setState({
          games,
          gameSummaries,
        });
      });
    fetch(`/api/users/${this.props.user}/awards`)
      .then((res) => res.json())
      .then(({ awards }) => {
        this.setState({ awards });
      });
  }

  render() {
    const {
      user,
      deckID,
      isMobile,
    } = this.props;

    const {
      games,
      gameSummaries,
      awards,
    } = this.state;

    return (
      <div className="games-screen">
        <ContainerFull width="100%" padding="0" marginTop="4rem">
          <Table
            user={user}
            deckID={deckID}
            games={games}
            gameSummaries={gameSummaries}
            awards={awards.filter((award) => award.deck_uuid === deckID)}
            isMobile={isMobile}
          />
        </ContainerFull>
      </div>
    );
  }
}

export default GamesScreen;
