import React, { Component } from 'react';
import Skeleton from 'react-skeleton-loader';
import styled from 'styled-components';
import _ from 'lodash';
import fetchData from './fetch';
import Games from './Games';
import Link from '../Components/Link';
import getS3Image from '../getS3Image';
import colors from '../colors';
import Achievement from '../Components/Achievement';
import metadata from '../achievements/metadata';
import levels from '../user-levels';
import calculateUserLevel from '../../shared/calculateUserLevel';
import Achievements from './Achievements';

const Container = styled.div`
  background-color: #FFF;
  min-height: 100vh;
`;

const Content = styled.div`
  margin: 1rem auto 0;
  max-width: 1000px;
`;

const Header = styled.div`
  margin: -2rem auto 0;
  padding: 0.75rem;
  background-color: #FFF;
  max-width: 1000px;
  display: flex;
  align-items: center;
`;

const UserName = styled.div`
  margin-left: 0.25rem;
  text-decoration: none;
  font-size: 24px;
  color: #000;
  pointer-events: none;
`;

const UserIcon = (props) => {
  const {
    user, progress, loaded
  } = props;
  const levelNum = props.level;
  let level;

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

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
    }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.25rem 0.5rem',
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
        <UserName>{user}</UserName>
      </div>
      <div style={{
        backgroundColor: levelColor,
        borderRadius: '0.25rem',
        marginTop: '0.25rem',
        marginLeft: '0.25rem',
        padding: '0.25rem 0.4rem',
        fontSize: '12px',
        color: '#000',
        display: 'flex',
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
  );
};

const BlueBackground = styled.div`
  width: 100%;
  height: 9.5rem;
  background: rgb(75,63,245);
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

class UserScreen extends Component {
  constructor() {
    super();
    this.state = {
      userLevel: 1,
      userProgress: 0,
      games: [],
      awards: [],
      loaded: false,
    };
  }

  componentDidMount(prevProps, prevState, snapshot) {
    if (!this.props.user) {
      return;
    }
    fetchData(this.props.user)
      .then(({ games }) => {
        this.setState({
          games,
          loaded: true,
        });
      });
    fetch(`/api/users/${this.props.user}/awards`)
      .then((res) => res.json())
      .then(({ awards }) => {
        this.setState({ awards });
      });
    fetch(`/api/users/${this.props.user}/level`)
      .then((res) => res.json())
      .then(({ level, progress }) => {
        this.setState({
          userLevel: level,
          userProgress: progress,
        });
      });
  }

  render() {
    const {
      user,
      isMobile,
    } = this.props;
    const {
      games,
      awards,
      loaded,
    } = this.state;
    let {
      userLevel,
      userProgress,
    } = this.state;

    const hasViewableGame = games.find((g) => g.winner === user || g.loser === user);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const isAnonymous = loaded && (games.length === 0 || !hasViewableGame);

    if (isAnonymous) {
      userLevel = 1;
      userProgress = 0;
    }

    return (
      <Container>
        <BlueBackground />
        <Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <UserIcon user={user} level={userLevel} progress={userProgress} loaded={loaded} />
          </div>
        </Header>
        <Content>
          {isAnonymous && (
            <div style={{ margin: '2rem 1rem' }}>
              <div>
                No data is available for this user
              </div>
              <br />
              <div>
                {'To record data, install the '}
                <a href="https://chrome.google.com/webstore/detail/crucible-tracker/kofdhlbkhmcjaknedcblchhmlilmfadk?hl=en">Crucible Tracker</a>
                {' Chrome extension'}
              </div>
            </div>
          )}
          {!isAnonymous && (
            <>
              <Games
                awards={awards}
                games={games}
                user={user}
                isMobile={isMobile}
              />
              <br />
              <Achievements user={user} isMobile={isMobile} />
            </>
          )}
          <br />
          <br />
        </Content>
      </Container>
    );
  }
}
export default UserScreen;
