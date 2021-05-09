import React from 'react';
import moment from 'moment';

class GameSummary extends React.Component {
  render() {
    const {
      game,
      deckID,
      user,
      isMobile,
    } = this.props;

    const isVictory = game.winner_deck_id === deckID;
    const ownKeys = isVictory ? game.winner_keys : game.loser_keys;
    const ownChecks = isVictory ? game.winner_checks : game.loser_checks;

    const pilot = isVictory ? game.winner : game.loser;
    const opponent = isVictory ? game.loser : game.winner;
    const opponentKeys = !isVictory ? game.winner_keys : game.loser_keys;
    const opponentChecks = !isVictory ? game.winner_checks : game.loser_checks;

    const ownDeckID = isVictory ? game.winner_deck_id : game.loser_deck_id;
    const opponentDeckID = !isVictory ? game.winner_deck_id : game.loser_deck_id;
    const pilotURL = `${window.location.origin}/users/${pilot}/games`;
    const opponentURL = `${window.location.origin}/users/${opponent}/games`;
    const turns = Math.ceil(game.turns / 2);
    let date = moment(game.date).fromNow();
    date = date[0].toUpperCase() + date.slice(1);

    return (
      <div
        className="game"
        key={game.id}
        style={{
          background: 'rgb(255, 255, 255)',
          marginBottom: '5px',
          padding: '5px 10px 0 0',
          borderTop: 'thin dashed rgba(170, 170, 170, 0.5)',
          color: 'black',
          width: isMobile ? 'calc(100vw - 30px)' : 'calc(100vw - 40px)',
        }}
      >
        <div style={{
          padding: '10px 0',
          display: 'flex',
          alignItems: 'center',
          flexWrap: isMobile ? '' : 'wrap',
        }}
        >
          <div style={game.winner_deck_id === deckID ? {
            backgroundColor: '#77DD77',
            fontSize: '11px',
            padding: '2px 5px',
            margin: '5px 0',
            width: 'fit-content',
          } : {
            backgroundColor: '#CCC',
            fontSize: '11px',
            padding: '2px 5px',
            margin: '5px 0',
            width: 'fit-content',
          }}
          >
            { isVictory ? 'win' : 'loss' }
          </div>

          {
            !isMobile ? (
              <>
                { opponent === 'anonymous'
                  ? <span style={{ margin: '5px 0', marginLeft: '0.75rem' }}>anonymous</span>
                  : <a href={opponentURL} style={{ textDecoration: 'none', margin: '5px 0', marginLeft: '0.75rem' }}>{opponent}</a>}
                <span style={{ marginLeft: '10px' }}>playing</span>
                {!isVictory
                  ? (
                    <a
                      style={{ margin: '5px 0', marginLeft: '10px', textDecoration: 'none' }}
                      target="_blank"
                      href={`https://www.keyforgegame.com/decks/${game.winner_deck_id}`}
                      rel="noreferrer"
                    >
                      {game.winner_deck_name}
                    </a>
                  )
                  : (
                    <a
                      style={{ margin: '5px 0', marginLeft: '10px', textDecoration: 'none' }}
                      target="_blank"
                      href={`https://www.keyforgegame.com/decks/${game.loser_deck_id}`}
                      rel="noreferrer"
                    >
                      {game.loser_deck_name}
                    </a>
                  )}
              </>
            ) : (
              <a
                href={`/games/${game.crucible_game_id}`}
                style={{
                  textDecoration: 'none', color: '#000', marginLeft: '0.75rem', whiteSpace: 'pre-wrap', wordWrap: 'break-word'
                }}
              >
                {`versus "${!isVictory ? game.winner_deck_name : game.loser_deck_name}"`}
              </a>
            )
          }
          {!isMobile && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            textAlign: 'right',
            fontSize: '11px',
          }}
          >
            <div><a href={`/games/${game.crucible_game_id}`} style={{ marginBottom: '2px', textDecoration: 'none', fontSize: '12px', }}>MATCH DETAILS</a></div>
            {date}
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default GameSummary;
