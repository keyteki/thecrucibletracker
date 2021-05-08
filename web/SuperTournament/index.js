import React from 'react';
import {
  TextField,
  Button,
  Checkbox,
  Tooltip,
} from '@material-ui/core';
import Container from 'Components/ContainerFull';
import Background from 'Components/Background';
import Link from 'Components/Link';
import Deck from 'Components/Deck';
import _ from 'lodash';
import styled from 'styled-components';

const Logo = styled.div`
  width: fit-content;
  color: white;
  background-color: rgb(75,63,245);
  font-weight: bold;
  font-size: 1.6rem;
  margin-bottom: 1rem;
  padding: 1rem;
  box-shadow: rgba(0,0,0,0.4) 2px 2px 5px;
`;

class Leaderboards extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    fetch('/api/leaderboards')
      .then((res) => res.json())
      .then(({ leaderboards }) => {
        this.setState({
          leaderboard: leaderboards[0],
          loading: false,
        });
      });
  }

  render() {
    const {
      leaderboard,
      loading,
    } = this.state;
    const {
      isMobile
    } = this.props;

    if (loading) {
      return (
        <Container width="calc(100% - 3rem)" margin="1.5rem">
          Loading
        </Container>
      );
    }

    const players = [ {
      name: 'Varghast',
      deckID: '2f1d2c9b-f0e6-4a1b-a374-3992aa2d8370',
      deckName: 'Azaquick, Arena Rascal',
      wins: 117,
      losses: 20,
      elo: 1918,
      rank: 2,
      alive: true,
    }, {
      name: 'JayPower',
      deckID: '23e8b708-4d1c-409b-8c68-4f814db41798',
      deckName: 'A. Maubenc, la Generosa',
      wins: 170,
      losses: 22,
      elo: 1934,
      rank: 1,
      alive: true,
    }, {
      name: 'xraycreator',
      deckID: '472a0eb2-016c-4bac-8216-7ad58d3f6dc4',
      deckName: 'Jaguhurt, the Scavenger',
      wins: 241,
      losses: 49,
      elo: 1853,
      rank: 3,
      alive: false,
    }, {
      name: 'jfilipeg',
      deckID: 'c389b5b2-7ddc-4981-ba60-46fd91251e0f',
      deckName: 'Much-Improved Nour',
      wins: 134,
      losses: 31,
      elo: 1840,
      rank: 4,
      alive: true,
    } ];

    const playerRanks = _.keyBy(players, 'rank');

    const top2 = [ players[0] ];
    return (
      <div
        style={{
          maxWidth: '52rem',
          margin: '6rem auto 2rem',
        }}
      >
        <Background />
        <div style={{
          background: '#FFF',
          position: 'relative',
        }}
        >
          <div style={{
            fontSize: '26px',
            marginBottom: '4rem',
            display: 'flex',
            justifyContent: 'center',
          }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
            >
              <Logo>Super Tournament 2</Logo>
              <div style={{
                fontWeight: '300',
                width: '280px',
                whiteSpace: 'pre-wrap',
                textAlign: 'center',
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '0.5rem',
              }}
              >
                An invite-only Bo3 Archon Solo event for top ranked players on The Crucible Tracker's leaderboard.
              </div>
              <div>
                <Link
                  newTab
                  style={{ fontSize: '16px', display: 'none' }}
                  url="https://www.youtube.com/playlist?list=PLIvOXGD0Xnu-xFbiVQxdIMx5mu47fx5lA"
                  text="Watch on Youtube"
                />
              </div>
              <div style={{
                position: 'absolute',
                top: '330px',
                fontWeight: '300',
                fontSize: isMobile ? '13px' : '18px',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '0.5rem',
                visibility: isMobile ? 'hidden' : '',
              }}
              >
                $75 for 1st
              </div>
            </div>
          </div>
          { isMobile ? (
            <div>
              <img style={{ width: '100%' }} src="/images/super-tournament-2.png" />
            </div>
          ) : (
            <div style={{ marginTop: '-40px' }}>
              <div style={{
                position: 'absolute',
                top: '150px',
                left: '-195px',
                pointerEvents: 'none',
              }}
              >
                <svg height="360" width="712">
                  <path d="M474 163 H488 V20 H474" fill="transparent" stroke="#AAA" />
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{
                  background: '#EEE',
                  width: '220px',
                  height: 'fit-content',
                  padding: '0.5rem',
                  overflow: 'hidden',
                  whiteSpace: 'no-wrap',
                  textAlign: 'right',
                  border: '1px solid #AAA',
                }}
                >
                  <div>
                    <Link
                      newTab
                      text={playerRanks[1].name}
                      style={{
                        fontSize: '20px',
                        textDecoration: playerRanks[1].alive ? '' : 'line-through',
                        color: playerRanks[1].alive ? '' : '#767676'
                      }}
                      url={`/users/${playerRanks[1].name}`}
                    />
                  </div>
                  <div>
                    <Link
                      newTab
                      type="secondary"
                      style={{
                        fontSize: '16px',
                        textDecoration: playerRanks[1].alive ? '' : 'line-through'
                      }}
                      text={playerRanks[1].deckName.slice(0, 28)}
                      url={`/users/${playerRanks[1].name}/decks/${playerRanks[1].deckID}`}
                    />
                  </div>
                </div>
                <div style={{
                  margin: '52px 1rem 0 1rem',
                  width: '200px',
                }}
                >
                  <div style={{
                    height: '40px',
                    background: '#EEE',
                    border: '1px solid #AAA',
                    borderBottom: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  >
                    { top2[0] && (
                    <Link
                      newTab
                      text={top2[0].name}
                      style={{ fontSize: '20px' }}
                      url={`/users/${top2[0].name}/decks/${top2[0].deckID}`}
                    />
                    ) }
                  </div>
                  <div style={{
                    height: '40px',
                    background: '#EEE',
                    border: '1px solid #AAA',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  >
                    { top2[1] && (
                    <Link
                      newTab
                      text={top2[1].name}
                      style={{
                        fontSize: '20px',
                        textDecoration: top2[1].alive ? '' : 'line-through',
                        color: top2[1].alive ? '' : '#767676'
                      }}
                      url={`/users/${top2[1].name}/decks/${top2[1].deckID}`}
                    />
                    )}
                  </div>
                </div>
                <div style={{
                  background: '#EEE',
                  width: '220px',
                  height: 'fit-content',
                  padding: '0.5rem',
                  overflow: 'hidden',
                  whiteSpace: 'no-wrap',
                  textAlign: 'left',
                  border: '1px solid #AAA',
                }}
                >
                  <div>
                    <Link
                      newTab
                      text={playerRanks[2].name}
                      style={{ fontSize: '20px' }}
                      url={`/users/${playerRanks[2].name}`}
                    />
                  </div>
                  <div>
                    <Link
                      newTab
                      type="secondary"
                      style={{ fontSize: '16px' }}
                      text={playerRanks[2].deckName.slice(0, 28)}
                      url={`/users/${playerRanks[2].name}/decks/${playerRanks[2].deckID}`}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-1rem', }}>
                <div style={{
                  position: 'absolute',
                  top: '150px',
                  left: '80px',
                  pointerEvents: 'none',
                }}
                >
                  <svg height="360" width="712">
                    <path d="M474 163 H460 V20 H474" fill="transparent" stroke="#AAA" />
                  </svg>
                </div>
                <div style={{
                  background: '#EEE',
                  border: '1px solid #AAA',
                  width: '220px',
                  height: 'fit-content',
                  padding: '0.5rem',
                  overflow: 'hidden',
                  whiteSpace: 'no-wrap',
                  textAlign: 'right',
                }}
                >
                  <div>
                    <Link
                      newTab
                      text={playerRanks[4].name}
                      style={{
                        fontSize: '20px',
                        textDecoration: playerRanks[4].alive ? '' : 'line-through',
                        color: playerRanks[4].alive ? '' : '#767676'
                      }}
                      url={`/users/${playerRanks[4].name}`}
                    />
                  </div>
                  <div>
                    <Link
                      newTab
                      type="secondary"
                      style={{
                        fontSize: '16px',
                        textDecoration: playerRanks[4].alive ? '' : 'line-through'
                      }}
                      text={playerRanks[4].deckName.slice(0, 28)}
                      url={`/users/${playerRanks[4].name}/decks/${playerRanks[4].deckID}`}
                    />
                  </div>
                </div>
                <div>
                  <div style={{
                    background: 'transparent',
                    margin: '2rem 1rem 0 1rem',
                    width: '200px',
                    height: '65px',
                    overflow: 'hidden',
                    whiteSpace: 'no-wrap',
                  }}
                  />
                </div>
                <div style={{
                  background: '#EEE',
                  border: '1px solid #AAA',
                  width: '220px',
                  height: 'fit-content',
                  padding: '0.5rem',
                  textAlign: 'left',
                }}
                >
                  <div>
                    <Link
                      newTab
                      text={playerRanks[3].name}
                      style={{
                        fontSize: '20px',
                        textDecoration: playerRanks[3].alive ? '' : 'line-through',
                        color: playerRanks[3].alive ? '' : '#767676'
                      }}
                      url={`/users/${playerRanks[3].name}`}
                    />
                  </div>
                  <div>
                    <Link
                      newTab
                      type="secondary"
                      style={{
                        fontSize: '16px',
                        textDecoration: playerRanks[3].alive ? '' : 'line-through'
                      }}
                      text={playerRanks[3].deckName.slice(0, 28)}
                      url={`/users/${playerRanks[3].name}/decks/${playerRanks[3].deckID}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={{
            marginTop: isMobile ? '2rem' : '5rem',
          }}
          >
            <div style={{
              margin: isMobile ? '2rem 0 1rem' : '5rem 0 1rem',
            }}
            />
            {[
              _.find(players, { rank: 1 }),
              _.find(players, { rank: 2 }),
              _.find(players, { rank: 3 }),
              _.find(players, { rank: 4 }),
            ].map((player) => (
              (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginBottom: isMobile ? '2rem' : '5rem',
                  }}
                  key={player.name}
                >
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}
                  >
                    {`${player.name}`}
                    <div style={{ fontSize: '16px', marginTop: '0.5rem' }}>
                      <div>
                        {`${player.elo} elo`}
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>{`${player.wins} wins - ${player.losses} losses`}</div>
                    </div>
                  </div>
                  <a href={`https://decksofkeyforge.com/decks/${player.deckID}`} target="_blank">
                    <Deck uuid={player.deckID} isMobile={isMobile} height={600} width={428} />
                  </a>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboards;
