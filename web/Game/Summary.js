import React, { Component, } from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChartistGraph from 'react-chartist';

class TimePlayed extends Component {
  render() {
    const { player, times } = this.props;
    if (_.isEmpty(times)) {
      return null;
    }

    const time = Math.max((times[player].total / 60).toFixed(0), 1);

    if (time < 0) {
      return null;
    }

    return (
      <div className="stat">
        <div className="stat-value" style={{ marginLeft: '10px', }}>
          {`${time} minutes `}
        </div>
      </div>
    );
  }
}

class Summary extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount(prevProps, prevState, snapshot) {
    fetch(`/api/games/${this.props.game.id}/player-times`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ times: data });
      });
  }

  render() {
    const {
      game
    } = this.props;
    const {
      times
    } = this.state;

    if (!game) {
      return null;
    }

    const results = [ 'winner', 'loser' ];

    const winnerCardsPlayed = (game.winner_artifacts_played || 0)
      + (game.winner_actions_played || 0)
      + (game.winner_upgrades_played || 0)
      + (game.winner_creatures_played || 0);
    const loserCardsPlayed = (game.loser_artifacts_played || 0)
      + (game.loser_actions_played || 0)
      + (game.loser_upgrades_played || 0)
      + (game.loser_creatures_played || 0);

    const showTimeGraph = _.keys(times).length > 0;
    let data = {};
    let options = {};
    if (showTimeGraph) {
      data = {
        labels: _.sortBy(
          _.keys(
            _.values(times)[0].turnTimes
          ).map((n) => Number.parseInt(n, 10))
        ),
        series: [
          _.values(
            _.values(times)[0].turnTimes
          ),
          _.keys(times).length > 1 ? (
            _.values(
              _.values(times)[0].turnTimes
            ).map((n) => 0)
          ) : [],
          _.keys(times).length > 1 ? (
            _.values(
              _.values(times)[1].turnTimes
            )
          ) : [],
        ]
      };

      options = {
        seriesBarDistance: 10,
        axisY: {
          labelInterpolationFnc(value) {
            return `${value}s`;
          }
        }
      };
    }

    return (
      <div className="player-stats-container">
        {results.map((result) => {
          const turnsBrobnar = game[`${result}_turns_brobnar`];
          const turnsDis = game[`${result}_turns_dis`];
          const turnsLogos = game[`${result}_turns_logos`];
          const turnsMars = game[`${result}_turns_mars`];
          const turnsSanctum = game[`${result}_turns_sanctum`];
          const turnsShadows = game[`${result}_turns_shadows`];
          const turnsUntamed = game[`${result}_turns_untamed`];
          const turnsSaurian = game[`${result}_turns_saurian`];
          const turnsStarAlliance = game[`${result}_turns_star_alliance`];
          const cardsPlayed = result === 'winner' ? winnerCardsPlayed : loserCardsPlayed;

          return (
            <div key={result} className="player-stats" style={result === 'winner' ? { padding: '0 10px 10px 10px', } : { padding: '10px', }}>
              {result === 'winner'
                ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <div className="deck-name">
                      {game[result] === 'anonymous' ? <span className="deck-name">anonymous</span> : <a className="deck-name" href={`/users/${game[result]}`}>{ game[result] }</a>}
                      <span style={{ margin: '0 10px 0 5px', fontSize: '20px' }}> using </span>
                      {' '}
                      <a className="deck-name" href={`https://keyforgegame.com/decks/${game[`${result}_deck_id`]}`}>{ game[`${result}_deck_name`] }</a>
                    </div>
                    <div style={{ textAlign: 'right', }}>
                      {moment(game.date).format('MMMM Do, YYYY')}
                    </div>
                  </div>
                )
                : (
                  <div className="deck-name">
                    {game[result] === 'anonymous' ? <span className="deck-name">anonymous</span> : <a className="deck-name" href={`/users/${game[result]}`}>{ game[result] }</a>}
                    <span style={{ margin: '0 10px 0 5px', fontSize: '20px' }}> using </span>
                    {' '}
                    <a className="deck-name" href={`https://keyforgegame.com/decks/${game[`${result}_deck_id`]}`}>{ game[`${result}_deck_name`] }</a>
                  </div>
                )}
              <div className="stats-container house-calls">
                {turnsBrobnar > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsBrobnar}</div>
                    <img src="/brobnar.png" />
                  </div>
                )}
                {turnsDis > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsDis}</div>
                    <img src="/dis.png" />
                  </div>
                )}
                {turnsLogos > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsLogos}</div>
                    <img src="/logos.png" />
                  </div>
                )}
                {turnsMars > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsMars}</div>
                    <img src="/mars.png" />
                  </div>
                )}
                {turnsSanctum > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsSanctum}</div>
                    <img src="/sanctum.png" />
                  </div>
                )}
                {turnsShadows > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsShadows}</div>
                    <img src="/shadows.png" />
                  </div>
                )}
                {turnsUntamed > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsUntamed}</div>
                    <img src="/untamed.png" />
                  </div>
                )}
                {turnsSaurian > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsSaurian}</div>
                    <img src="/saurian.png" />
                  </div>
                )}
                {turnsStarAlliance > 0 && (
                  <div className="stat" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div className="stat-value house">{turnsStarAlliance}</div>
                    <img src="/staralliance.png" />
                  </div>
                )}
                {cardsPlayed > 0 && (
                  <div className="stat">
                    <div className="stat-value" style={{ marginLeft: '10px', }}>
                      {`${cardsPlayed} cards played `}
                    </div>
                  </div>
                )}
                <TimePlayed gameID={game.id} player={game[result]} times={times} />
              </div>
            </div>
          );
        })}
        { showTimeGraph && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 0 1rem 1rem',
          }}
          >
            <div style={{
              margin: '0 2rem 0 0', background: '#F0F0F0', width: 'fit-content', padding: '0.25rem'
            }}
            >
              Seconds Per Turn
            </div>
            <div style={{
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
            >
              <div style={{
                width: '0.75rem',
                height: '0.75rem',
                background: '#d70206',
                borderRadius: '0.1rem',
                marginRight: '0.25rem'
              }}
              />
              {_.keys(times)[0]}
            </div>
            { _.keys(times).length > 1 && (
            <div style={{
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '1rem',
            }}
            >
              <div style={{
                width: '0.75rem',
                height: '0.75rem',
                background: '#f4c63d',
                borderRadius: '0.1rem',
                marginRight: '0.25rem'
              }}
              />
              {_.keys(times)[1]}
            </div>
            )}
          </div>
          <div style={{ maxWidth: '50rem' }}>
            <ChartistGraph data={data} options={options} type="Bar" />
          </div>
        </div>
        )}
      </div>
    );
  }
}

export default Summary;
