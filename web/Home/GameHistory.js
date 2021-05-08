import React, { Component, } from 'react';
import Skeleton from 'react-skeleton-loader';
import styled from 'styled-components';
import levels from '../user-levels';
import getS3Image from '../getS3Image';
import colors from '../colors';

const GameContainer = styled.a`
  margin: 5px -5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px dashed #AAA;
  cursor: pointer;
  text-decoration: none;
  color: #000;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: #EEE;
  }
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  padding: ${(props) => props.padding};
`;

class UserIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 1,
      progress: 0,
      loaded: false,
    };
  }

  componentDidMount() {
    if (this.props.user === 'anonymous') {
      this.setState({
        level: 1,
        progress: 0,
        loaded: true,
      });
    } else {
      fetch(`/api/users/${this.props.user}/level`)
        .then((res) => res.json())
        .then(({ level, progress }) => {
          this.setState({
            level,
            progress,
            loaded: true,
          });
        });
    }
  }

  render() {
    const {
      user,
      alignRight,
    } = this.props;

    const levelNum = this.state.level;
    let level;

    const {
      progress,
      loaded
    } = this.state;

    if (levelNum > 50) {
      let highest = 50;
      _.forEach(levels, (level) => {
        if (levelNum >= level.number) {
          highest = Math.max(highest, level.number);
        }
      });
      level = _.find(levels, { number: highest });
    } else {
      level = _.find(levels, { number: levelNum });
    }

    const levelColor = levelNum <= 10
      ? colors.gray : levelNum <= 20
        ? colors.green : levelNum <= 30
          ? '#699af0' : levelNum <= 40
            ? colors.red : levelNum <= 50
              ? '#a27ee6' : levelNum < 60
                ? 'gold' : 'rgb(81, 180, 175)';

    const thumbnail = (
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            overflow: 'hidden',
            marginRight: '0.25rem',
            border: '2px solid #2F4F4F',
            borderRadius: '5px',
            backgroundColor: colors.gray,
            boxShadow: 'rgba(0, 0, 0, 0.2) 2px 2px 5px 0px',
          }}
          >
            {loaded && (
            <img
              src={getS3Image(level.image)}
              style={level.style}
            />
            )}
          </div>
        </div>
      </div>
    );

    const name = (
      <div>
        <div style={{
          fontSize: '20px',
          marginTop: '-5px',
          marginLeft: alignRight ? 0 : '0.25rem',
          marginRight: alignRight ? '0.5rem' : 0,
          textAlign: alignRight ? 'right' : 'left',
        }}
        >
          {user}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: alignRight ? 'flex-end' : '',
          marginLeft: alignRight ? 0 : '0.25rem',
          marginRight: alignRight ? '0.5rem' : 0,
        }}
        >
          <div style={{
            backgroundColor: levelColor,
            borderRadius: '0.25rem',
            marginTop: '0.25rem',
            padding: '0.25rem 0.4rem',
            fontSize: '12px',
            color: '#000',
            display: 'inline-flex',
            alignItems: 'center',
            boxShadow: 'rgba(0, 0, 0, 0.2) 1px 1px 2px 0px',
          }}
          >
            { `Level ${levelNum}` }
            <div style={{
              marginLeft: '0.25rem',
              marginTop: '0.1rem',
              backgroundColor: '#FFF',
              borderRadius: '5px',
              height: '14px',
              width: '40px',
              boxShadow: 'rgba(0, 0, 0, 0.1) 1px 1px 2px 0px',
            }}
            >
              {loaded && (
              <div style={{
                marginLeft: '0.25rem',
                marginTop: '0.2rem',
                backgroundColor: colors.green,
                borderBottom: '1px solid #65c265',
                borderRight: '1px solid #65c265',
                borderRadius: '5px',
                height: '7px',
                width: `${progress * 30}px`,
              }}
              />
              )}
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <UserContainer padding={alignRight ? '0.5rem 0 0.5rem 0.5rem' : '0.5rem 0.5rem 0.5rem 0'}>
        { alignRight ? (
          <>
            {name}
            {thumbnail}
          </>
        ) : (
          <>
            {thumbnail}
            {name}
          </>
        )}
      </UserContainer>
    );
  }
}

class GameHistory extends Component {
  render() {
    const {
      games,
      totalGames,
      gamesLast7Days,
      setAchievementIndex,
      achievementIndex,
      gamesInSets,
      isMobile,
    } = this.props;

    if (!games.length) {
      return (
        <div style={{
          width: isMobile ? 'calc(100% - 20px)' : '600px',
          margin: '0 auto',
          padding: '10px',
          backgroundColor: 'white',
          borderRadius: '2px',
          boxShadow: 'rgba(0, 0, 0, 0.2) 2px 2px 5px 0px',
        }}
        >
          <Skeleton
            animated={false}
            borderRadius={0}
            width="100%"
            height="40px"
            count={10}
          />
        </div>
      );
    }

    const gameElements = games.map((game) => {
      const date = new Date(game.date);
      const month = (`${1 + date.getMonth()}`).length === 1 ? `0${1 + date.getMonth()}` : (1 + date.getMonth());
      const day = (`${date.getDate()}`).length === 1 ? `0${date.getDate()}` : date.getDate();
      const dateString = `${date.getFullYear()}/${month}/${day}`;

      let winner = (
        <UserIcon user={game.winner} level={Math.random() * 50 | 0} progress={Math.random()} />
      );

      let loser = (
        <UserIcon user={game.loser} level={Math.random() * 50 | 0} progress={Math.random()} alignRight={!isMobile} />
      );

      if (game.winner === 'anonymous') {
        winner = (
          <UserIcon user="anonymous" level={1} progress={0} />
        );
      }

      if (game.loser === 'anonymous') {
        loser = (
          <UserIcon user="anonymous" level={1} progress={0} alignRight={!isMobile} />
        );
      }

      return (
        <GameContainer
          key={game.date}
          href={`${window.location.origin}/games/${game.crucibleGameID}`}
        >
          { isMobile ? (
            <div>
              <div>
                {winner}
              </div>
              <div style={{ fontSize: '18px', margin: '5px 10px' }}> versus </div>
              <div>
                {loser}
              </div>
            </div>
          ) : (
            <>
              <div style={{ width: '45%', overflow: 'hidden' }}>
                {winner}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}> versus </div>
              <div style={{
                width: '45%', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end'
              }}
              >
                {loser}
              </div>
            </>
          )}
        </GameContainer>
      );
    });

    return (
      <div style={{
        width: isMobile ? 'calc(100% - 20px)' : '600px',
        margin: '0 auto',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '2px',
        boxShadow: 'rgba(0, 0, 0, 0.2) 2px 2px 5px 0px',
        fontSize: isMobile ? '16px' : '16px',
      }}
      >
        <div style={{
          padding: '5px 0',
        }}
        >
          <div style={{ margin: '15px 15px 0' }}>
            {'Total Games: '}
            {totalGames.toLocaleString()}
          </div>
          {gameElements}
        </div>
      </div>
    );
  }
}

export default GameHistory;
