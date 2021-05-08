import React, { Component, } from 'react';
import styled from 'styled-components';
import GameHistory from './GameHistory';
import Link from '../Components/Link';
import NavDesktop from './NavDesktop';
import NavMobile from './NavMobile';
import Background from '../Components/Background';

const BlockTextImageDesktop = styled.div`
  margin-top: 50px;
  display: grid;
  grid-template-areas: "text image";
  justify-content: center;
  align-items: center;
`;

const BlockImageTextDesktop = styled(BlockTextImageDesktop)`
  margin-top: 100px;
  grid-template-areas: "image text";
`;

const BlockMobile = styled.div`
  margin-top: 50px;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-areas: "text" "image";
  grid-template-columns: 100%;
  justify-content: center;
`;

const HeadlineContainerDesktop = styled.div`
  width: ${(props) => props.width || '620px'};
  padding: 0 10px;
  margin: 100px auto 60px;
`;

const HeadlineContainerMobile = styled(HeadlineContainerDesktop)`
  margin: 60px auto 50px;
`;

const Headline = styled.div`
  font-size: 40px;
  color: #FFF;
  margin-bottom: 20px;
  user-select: none;
`;

const Description = styled.div`
  font-size: 17px;
  color: #FFF;
  margin-bottom: 8px;
  font-weight: 300;
`;

const MainButtons = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: space-between;
  width: 350px;
`;

const PrimaryLink = styled.a`
  background-color: rgb(133, 221, 133);
  color: #000;
  padding: 10px 15px;
  height: fit-content;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgb(133, 225, 133);
  }
`;

const SecondaryLink = styled.a`
  background-color: #ffefd5;
  color: black;
  padding: 12px 15px;
  height: fit-content;
  font-size: 13px;
  text-decoration: none;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #F7F7F7;
  }
`;

const Search = styled.input`
  width: 89%;
  margin: -20px auto 40px;
  padding: 10px 12.5px;
  border: unset;
  font-size: 20px;
  border-radius: 2px;
  box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.2);
`;

class Screen extends Component {
  constructor() {
    super();
    this.searchBoxRef = React.createRef();
    this.state = {
      recentGames: [],
      totalGames: null,
      gamesLast7Days: null,
      gamesInSets: {
        341: 0,
        435: 0,
        452: 0,
      },
    };
  }

  componentDidMount(prevProps, prevState, snapshot) {
    const fetchSummary = () => {
      fetch('/api/summary')
        .then((response) => response.json())
        .then(({
          recentGames, totalGames, gamesInSets, gamesLast7Days,
        }) => {
          this.setState({
            recentGames,
            totalGames,
            gamesLast7Days,
            gamesInSets,
          });
        });
    };
    setInterval(fetchSummary, 1000 * 10);
    fetchSummary();
  }

  navigateToUser(username) {
    if (/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/.test(username)) {
      window.location.href = `${window.location.origin}/decks/${username}`;
    } else {
      window.location.href = `${window.location.origin}/users/${username}`;
    }
  }

  handleSearchClick() {
    const username = this.searchBoxRef.current.value;
    if (username) {
      this.navigateToUser(username);
    }
  }

  handleKeyDown(e) {
    const username = e.target.value;

    if (username && e.keyCode == 13) {
      this.navigateToUser(username);
    }
  }

  render() {
    const {
      recentGames,
      totalGames,
      gamesLast7Days,
      gamesInSets,
    } = this.state;

    const {
      isMobile
    } = this.props;

    return (
      <div style={{
        userSelect: 'none',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      >
        {isMobile && <NavMobile />}
        {!isMobile && <NavDesktop />}
        <HeadlineContainerDesktop width={isMobile ? 'unset' : undefined}>
          <Headline>
            Track your KeyForge data
          </Headline>
          <Description>
            {'The Crucible Tracker is a stat tracker for '}
            <Link
              url="https://thecrucible.online/play"
              text="thecrucible.online"
              color="#FFF"
              newTab
            />
          </Description>
          <MainButtons>
            <PrimaryLink
              target="_blank"
              href="https://chrome.google.com/webstore/detail/crucible-tracker/kofdhlbkhmcjaknedcblchhmlilmfadk?hl=en"
            >
              Install Chrome Extension
            </PrimaryLink>
            <SecondaryLink
              href="/users/Ugluk4242"
            >
              Example Data
            </SecondaryLink>
          </MainButtons>

        </HeadlineContainerDesktop>

        <GameHistory
          games={recentGames}
          gamesLast7Days={gamesLast7Days}
          totalGames={totalGames}
          gamesInSets={gamesInSets}
          isMobile={isMobile}
        />
      </div>
    );
  }
}

export default Screen;
