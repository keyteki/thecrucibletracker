import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'Components/Link';

const Nav = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 15px;
`;

const Search = styled.input`
  width: 240px;
  padding: 10px 12.5px;
  border: unset;
  font-size: 14px;
  border-radius: 2px;
  margin-right: 5px;
  box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.2);
`;

const NavLink = styled.a`
  cursor: pointer;
  margin: 0 15px;
  text-decoration: none;
  color: #FFF;
  font-size: 17px;

  &:hover {
    text-decoration: none;
    color: rgba(0, 0, 0, 1);
  }
`;

export default class NavDesktop extends Component {
  constructor() {
    super();
    this.searchBoxRef = React.createRef();
  }

  navigateToUser(username) {
    if (/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/.test(username)) {
      window.location.href = `${window.location.origin}/decks/${username}`;
    } else {
      window.location.href = `${window.location.origin}/users/${username}`;
    }
  }

  handleSearchClick(e) {
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
    return (
      <div>
        <Nav>
          <Link
            text="Hall of Fame"
            url="/hall-of-fame"
            style={{ color: '#FFF', marginRight: '2rem' }}
          />
          <Link
            text="Leaderboards"
            url="/leaderboards"
            style={{ color: '#FFF', marginRight: '2rem' }}
          />
          <Search
            placeholder="Search for a username"
            ref={this.searchBoxRef}
            onKeyDown={this.handleKeyDown.bind(this)}
          />
        </Nav>
      </div>
    );
  }
}
