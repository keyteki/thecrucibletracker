import React, { Component, } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  useRouteMatch
} from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Toaster } from 'react-hot-toast';
import Home from './Home';
import UserPage from './User';
import DeckPage from './Deck';
import GamePage from './Game';
import Leaderboards from './Leaderboards';
import SuperTournament from './SuperTournament';
import HallOfFame from './HallOfFame';

import SimpleNav from './Components/NavBar';
import './app.css';
import './set-data';

class App extends Component {
  onSearch(e) {
    const username = e.target.value;
    if (username && e.keyCode == 13) {
      window.location.href = `${window.location.origin}/users/${username}`;
    }
  }

  render() {
    const { isMobile } = this.props;

    const routes = [ {
      Component: DeckPage,
      route: '/decks/:deckID',
    }, {
      Component: DeckPage,
      route: '/users/:user/decks/:deckID',
    }, {
      Component: GamePage,
      route: '/games/:gameID',
    }, {
      Component: UserPage,
      route: '/users/:user',
    }, {
      Component: UserPage,
      route: '/users/:user/games',
    }, {
      Component: HallOfFame,
      route: '/hall-of-fame',
    }, {
      Component: Leaderboards,
      route: '/leaderboards',
    }, {
      Component: Leaderboards,
      route: '/leaderboard',
    }, {
      Component: SuperTournament,
      route: '/tournament',
    }, {
      Component: SuperTournament,
      route: '/tournaments',
    } ];

    return (
      <Router>
        <Toaster />
        <div style={{ width: '100%', }}>
          {routes.map(({ route, Component }) => (
            <Route
              key={`route-${route}`}
              path={route}
              exact
              render={({ match }) => (
                <div>
                  <SimpleNav isMobile={isMobile} />
                  <Component match={match} isMobile={isMobile} {...match.params} />
                </div>
              )}
            />
          ))}

          <Route
            path="/"
            exact
          >
            <Home />
          </Route>
        </div>
      </Router>
    );
  }
}

export default () => (
  <App isMobile={useMediaQuery({ maxWidth: 767, })} />
);
