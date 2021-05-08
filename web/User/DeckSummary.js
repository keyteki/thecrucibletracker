import React from 'react';
import moment from 'moment';
import Link from '../Components/Link';

const StatTitle = (text, styles) => (
  <div style={({
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    ...styles,
  })}
  >
    {text}
  </div>
);

const StatValue = (text, styles) => (
  <div style={({ fontSize: '14px', ...styles, })}>
    {text}
  </div>
);

class Component extends React.Component {
  render() {
    const {
      user,
      deckName,
      deckID,
    } = this.props;
    let {
      games,
    } = this.props;

    games = games.sort((a, b) => moment(a).unix() - moment(b).unix());

    const wins = games.filter((game) => game.winner === user);
    const losses = games.filter((game) => game.winner !== user);

    return (
      <div style={{
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '5px',
      }}
      >
        <div style={{
          fontSize: '20px',
        }}
        >
          {deckName}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          marginLeft: '1rem',
        }}
        >
          <div style={{
            fontSize: '15px',
            marginTop: '10px',
            display: 'flex',
            marginRight: '50px',
          }}
          >
            <div style={{ marginRight: '20px' }}>
              <Link text="My games" url={`/users/${user}/decks/${deckID}`} />
            </div>
            <div>
              <Link text="Latest game" url={`/games/${games[0].crucible_game_id}`} type="secondary" fontSize="15px" />
            </div>
          </div>

          <div style={{ marginTop: '10px', display: 'flex' }}>
            {StatValue(`${wins.length}W - ${losses.length}L`, {
              fontSize: '15px',
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
