import React, { Component, } from 'react';
import Skeletons from './Skeletons';
import './table.css';
import _ from 'lodash';
import moment from 'moment';
import GameSummary from './GameSummary';
import expansions from '../../expansions';

const Stat = ({ title, value }) => (
  <div style={{
    margin: '10px 5px',
  }}
  >
    <div style={{
      fontWeight: 'bold',
      fontSize: '11px',
      color: '#666',
      textTransform: 'uppercase',
    }}
    >
      {title}
    </div>
    <div style={{
      fontSize: '17px',
    }}
    >
      {value}
    </div>
  </div>
);

class Table extends Component {
  render() {
    let {
      games,
      gameSummaries,
      awards,
    } = this.props;
    const {
      user,
      deckID,
      isMobile,
    } = this.props;

    let deckName = '';
    if (games[0]) {
      deckName = games[0].winner_deck_id === deckID ? games[0].winner_deck_name : games[0].loser_deck_name;
    }

    const wins = games.filter((g) => g.winner_deck_name === deckName);
    const losses = games.filter((g) => g.loser_deck_name === deckName);

    const winsAgaintSets = _.groupBy(wins, 'loser_deck_expansion');
    const lossesAgaintSets = _.groupBy(losses, 'winner_deck_expansion');
    _.forEach(expansions, (expansion) => {
      winsAgaintSets[expansion] = winsAgaintSets[expansion] || [];
      lossesAgaintSets[expansion] = lossesAgaintSets[expansion] || [];
    });

    gameSummaries = gameSummaries.filter((summary) => games.find((game) => game.id === summary.game_id));

    let gameLengthSum = 0;
    games.forEach((game) => {
      gameLengthSum += game.turns / 2;
    });
    const gameLengthAverage = Math.round(gameLengthSum / games.length);

    let cardsPlayedSum = 0;
    let cardsPlayedDiffSum = 0;
    gameSummaries.forEach((summary) => {
      const winnerCardsPlayed = (summary.winner_artifacts_played || 0)
        + (summary.winner_actions_played || 0)
        + (summary.winner_upgrades_played || 0)
        + (summary.winner_creatures_played || 0);
      const loserCardsPlayed = (summary.loser_artifacts_played || 0)
        + (summary.loser_actions_played || 0)
        + (summary.loser_upgrades_played || 0)
        + (summary.loser_creatures_played || 0);
      cardsPlayedSum += summary.winner === user ? winnerCardsPlayed : loserCardsPlayed;
      cardsPlayedDiffSum += summary.winner === user ? winnerCardsPlayed - loserCardsPlayed : loserCardsPlayed - winnerCardsPlayed;
    });
    const averageCardsPlayedDiff = cardsPlayedDiffSum / gameSummaries.length;
    const averageCardsPerTurn = cardsPlayedSum / games.length;

    if (games.length) {
      const gameEls = games.map((game) => {
        let summary;

        if (gameSummaries.length > 0) {
          summary = gameSummaries.find((s) => s.game_id === game.id);
        }

        return (
          <div className="game" key={game.id}>
            <GameSummary
              user={user}
              deckID={deckID}
              game={game}
              summary={summary}
              isMobile={isMobile}
            />
          </div>
        );
      });

      return (
        <div>
          <div>
            <div className="page-title" style={{ marginBottom: '1rem' }}>
              <div>
                { user && (
                  <>
                    <a
                      href={`https://www.thecrucibletracker.com/users/${user}`}
                      style={{
                        textDecoration: 'none'
                      }}
                    >
                      {user}
                    </a>
                    {' using '}
                  </>
                )}
                <a
                  href={`https://keyforgegame.com/decks/${deckID}`}
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  {deckName}
                </a>
              </div>
            </div>
            <div style={{
              marginLeft: '15px',
              display: 'flex',
              flexWrap: 'wrap',
            }}
            >
              <div style={{ margin: '10px 5px' }}>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#666',
                  textTransform: 'uppercase',
                }}
                >
                  GAMES
                </div>
                <div style={{
                  fontSize: '17px',
                }}
                >
                  {games.length}
                </div>
              </div>
              {Stat({
                title: 'WINS',
                value: wins.length,
              })}
              {Stat({
                title: 'LOSSES',
                value: losses.length,
              })}
              {Stat({
                title: 'WIN RATE',
                value: `${(wins.length / (wins.length + losses.length) * 100).toFixed(0)}%`
              })}
              { winsAgaintSets[expansions.cota].length + lossesAgaintSets[expansions.cota].length > 0
                && Stat({
                  title: 'VS CotA',
                  value: `${(winsAgaintSets[expansions.cota].length / (winsAgaintSets[expansions.cota].length + lossesAgaintSets[expansions.cota].length) * 100).toFixed(0)}%`
                })}
              { winsAgaintSets[expansions.aoa].length + lossesAgaintSets[expansions.aoa].length > 0
              && Stat({
                title: 'VS AoA',
                value:
                     `${(winsAgaintSets[expansions.aoa].length / (winsAgaintSets[expansions.aoa].length + lossesAgaintSets[expansions.aoa].length) * 100).toFixed(0)}%`
              })}
              { winsAgaintSets[expansions.wc].length + lossesAgaintSets[expansions.wc].length > 0
              && Stat({
                title: 'VS WC',
                value:
                    `${(winsAgaintSets[expansions.wc].length / (winsAgaintSets[expansions.wc].length + lossesAgaintSets[expansions.wc].length) * 100).toFixed(0)}%`
              })}
              { winsAgaintSets[expansions.mm].length + lossesAgaintSets[expansions.mm].length > 0
              && Stat({
                title: 'VS MM',
                value:
                    `${(winsAgaintSets[expansions.mm].length / (winsAgaintSets[expansions.mm].length + lossesAgaintSets[expansions.mm].length) * 100).toFixed(0)}%`
              })}
              { user && !Number.isNaN(averageCardsPlayedDiff) && Stat({
                title: 'Avg Efficiency',
                value: <span style={{
                  padding: '2px 4px',
                  marginTop: '3px',
                  fontSize: '14px'
                }}
                >
                  { averageCardsPlayedDiff >= 0 ? `+${averageCardsPlayedDiff.toFixed(1)} cards` : `${averageCardsPlayedDiff.toFixed(1)} cards` }
                       </span>
              })}
              { user && !Number.isNaN(averageCardsPerTurn) && Stat({
                title: 'Avg Cards Played',
                value: <span style={{
                  marginTop: '3px',
                  fontSize: '14px'
                }}
                >
                  { `${averageCardsPerTurn.toFixed(1)} cards` }
                       </span>
              })}
              { user && !Number.isNaN(gameLengthAverage) && Stat({
                title: 'Avg Length',
                value: <span style={{
                  marginTop: '3px',
                  fontSize: '14px'
                }}
                >
                  { `${gameLengthAverage} turns` }
                       </span>
              })}
            </div>
          </div>
          {awards.length > 0 && (
            <div style={{
              marginTop: '5px',
              marginLeft: '15px'
            }}
            >
              {awards.map((award) => (
                <a
                  style={{
                    color: '#000',
                    textDecoration: 'none',
                    border: '1px solid #c09e49',
                    borderRadius: '2px',
                    background: award.current ? '#ffd700' : '#efc04a',
                    padding: '0.5rem',
                    width: 'fit-content',
                    display: 'flex',
                    alignItems: 'baseline',
                  }}
                  href="/leaderboard"
                >
                  <div style={{
                    fontSize: '14px',
                  }}
                  >
                    Rank 1 on the leaderboard
                  </div>
                  { !award.current && (
                  <div style={{
                    fontSize: '14px',
                    textAlign: 'right',
                    marginLeft: '5px',
                  }}
                  >
                    {`${moment(award.date_created).fromNow()}`}
                  </div>
                  )}
                </a>
              ))}
            </div>
          )}
          <div style={{
            position: 'relative', marginTop: '20px', display: 'flex', flexDirection: 'row',
          }}
          >
            <div key={deckName} style={{ flexShrink: 0, flexGrow: 1, marginLeft: isMobile ? '10px' : '20px', }}>
              {gameEls}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Skeletons />
    );
  }
}

export default Table;
