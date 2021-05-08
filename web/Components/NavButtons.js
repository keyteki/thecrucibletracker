import React from 'react';
import styled from 'styled-components';

const Nav = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 15px;
`;

const Search = styled.input`
  width: 200px;
  padding: 10px 12.5px;
  border: unset;
  font-size: 14px;
  border-radius: 2px;
  box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.2);
`;

const NavLink = styled.a`
  cursor: pointer;
  margin: 0 15px;
  text-decoration: inherit;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 300;
  font-size: 15px;

  &:hover {
    text-decoration: underline;
    color: rgba(0, 0, 0, 1);
  }
`;

export default () => {
  const handleKeyDown = (e) => {
    const username = e.target.value;

    if (username && e.keyCode == 13) {
      window.location.href = `${window.location.origin}/users/${username}/games`;
    }
  };

  return (
    <Nav>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10px',
      }}
      >
        <NavLink href="/achievements">
          Achievements
        </NavLink>
        <NavLink href="/hall-of-fame">
          Hall of Fame
        </NavLink>
        <NavLink href="/leaderboards/month">
          Leaderboards
        </NavLink>
      </div>
      <Search
        placeholder="Search for a username"
        onKeyDown={handleKeyDown.bind(this)}
      />
    </Nav>
  );
};
