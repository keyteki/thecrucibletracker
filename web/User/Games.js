import React, { Component, } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DeckSummary from './DeckSummary';
import Skeleton from './Skeleton';
import Button from '../Components/Button';

class Games extends Component {
  constructor() {
    super();

    this.state = {
      sortBy: 'Games Played',
      sortDirection: 'Descending',
    };

    try {
      const sortBy = localStorage.getItem('sortBy');
      if (sortBy) this.state.sortBy = localStorage.getItem('sortBy');

      const sortDirection = localStorage.getItem('sortDirection');
      if (sortDirection) this.state.sortDirection = localStorage.getItem('sortDirection');
    } catch (e) {
      console.log(e);
    }
  }

  handleClickReset() {
    this.setState({
      sortBy: 'Games Played',
      sortDirection: 'Descending',
    });

    try {
      localStorage.setItem('sortBy', 'Games Played');
      localStorage.setItem('sortDirection', 'Descending');
    } catch (e) {
      console.log(e);
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    try {
      if (name == 'sortBy') {
        localStorage.setItem('sortBy', value);
      }
      if (name == 'sortDirection') {
        localStorage.setItem('sortDirection', value);
      }
    } catch (e) {
      console.log(e);
    }

    this.setState({
      [name]: value,
    });
  }

  render() {
    const {
      user,
      isMobile,
      games,
    } = this.props;
    const {
      sortBy,
      sortDirection,
      showAllGames,
    } = this.state;

    if (!games.length) {
      return (
        <div>
          <Skeleton />
        </div>
      );
    }

    let deckNames = [];
    games.forEach((game) => {
      if (user === game.winner && !deckNames.includes(game.winner_deck_name)) deckNames.push(game.winner_deck_name);
      if (user === game.loser && !deckNames.includes(game.loser_deck_name)) deckNames.push(game.loser_deck_name);
    });

    deckNames = deckNames.sort((a, b) => {
      const deckAGames = games.filter((g) => (g.winner === user && g.winner_deck_name === a) || (g.loser === user && g.loser_deck_name === a));
      const deckBGames = games.filter((g) => (g.winner === user && g.winner_deck_name === b) || (g.loser === user && g.loser_deck_name === b));

      if (sortBy === 'Last Played') {
        let deckAMaxDate = 0;
        let deckBMaxDate = 0;

        deckAGames.forEach((g) => deckAMaxDate = Math.max(deckAMaxDate, (new Date(g.date)).getTime()));
        deckBGames.forEach((g) => deckBMaxDate = Math.max(deckBMaxDate, (new Date(g.date)).getTime()));

        return sortDirection === 'Descending' ? deckBMaxDate - deckAMaxDate : deckAMaxDate - deckBMaxDate;
      }

      if (sortBy === 'Games Played') {
        return sortDirection === 'Descending' ? deckBGames.length - deckAGames.length : deckAGames.length - deckBGames.length;
      }
    });

    let totalVisibleGames = 0;
    let wins = 0;
    let losses = 0;
    const deckRows = deckNames.map((name) => {
      const deckGames = games.filter((g) => (g.winner === user && g.winner_deck_name === name) || (g.loser === user && g.loser_deck_name === name));
      totalVisibleGames += deckGames.length;

      const deckWins = deckGames.filter((g) => g.winner_deck_name === name);
      const deckLosses = deckGames.filter((g) => g.loser_deck_name === name);

      wins += deckWins.length;
      losses += deckLosses.length;

      const deckSummaries = games.filter((s) => deckGames.find((g) => g.id === s.id));
      const deckID = deckGames[0].winner === user ? deckGames[0].winner_deck_id : deckGames[0].loser_deck_id;

      return (
        <div key={name} className="deck-history">
          <div className="deck-data">
            <DeckSummary
              deckID={deckID}
              deckName={name}
              games={deckGames}
              gameSummaries={deckSummaries}
              user={user}
            />
          </div>
        </div>
      );
    }).filter((n) => n);

    return (
      <div style={{ display: 'flex' }}>
        <div style={{
          padding: '20px 60px 20px 20px',
          backgroundColor: '#eee',
          display: isMobile ? 'none' : 'flex',
          flexDirection: 'column',
        }}
        >
          <div style={{
            color: '#666666',
            marginBottom: '10px',
          }}
          >
            {`${totalVisibleGames} games with ${deckRows.length} decks`}
          </div>
          <div style={{
            color: '#666666',
            marginBottom: '10px',
          }}
          >
            {`${wins} wins, ${losses} losses`}
          </div>
          <FormControl style={{ marginRight: '20px', marginTop: '20px', }}>
            <InputLabel>Sort Decks By</InputLabel>
            <Select
              name="sortBy"
              value={sortBy}
              onChange={this.handleInputChange.bind(this)}
            >
              {[ 'Games Played', 'Last Played' ].map((key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl style={{ marginRight: '20px', marginTop: '20px', }}>
            <InputLabel>Sort Direction</InputLabel>
            <Select
              name="sortDirection"
              value={sortDirection}
              onChange={this.handleInputChange.bind(this)}
            >
              {[ 'Descending', 'Ascending', ].map((key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div style={{
          marginLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: '1',
        }}
        >
          {showAllGames ? deckRows : deckRows.slice(0, 5)}
          {(!showAllGames && deckRows.length > 5) && (
            <div style={{ marginLeft: '5px', marginTop: '10px', fontSize: '14px' }}>
              <Button
                text="SHOW ALL DECKS"
                type="secondary"
                onClick={() => this.setState({ showAllGames: true, })}
              />
            </div>
          )}
          <br />
        </div>
      </div>
    );
  }
}

export default Games;
