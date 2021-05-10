import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'Components/Link';

const BurgerLine = styled.div`
    width: 30px;
    height: 3px;
    background-color: #fff;
    margin: 7px 0;
`;

const Burger = ({ onClick }) => (
    <div onClick={onClick}>
        <BurgerLine />
        <BurgerLine />
        <BurgerLine />
    </div>
);

const NavContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 11;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 5px 0px;
`;

const NavLink = styled.a`
    cursor: pointer;
    margin: 0 15px;
    text-decoration: inherit;
    color: #000;
    font-size: 24px;
    margin-top: 30px;
    margin-bottom: 20px;

    &:hover {
        text-decoration: underline;
        color: rgba(0, 0, 0, 1);
    }
`;

// <NavLink href="/achievements">
// Achievements
// </NavLink>
const Nav = ({ onClick }) => (
    <NavContainer>
        <X onClick={onClick} />
        <Link
            text='Hall of Fame'
            url='/hall-of-fame'
            style={{ color: '#000', fontSize: '1.3rem', marginTop: '3rem' }}
        />
        <Link
            text='Leaderboards'
            url='/leaderboards'
            style={{ color: '#000', fontSize: '1.3rem', marginTop: '3rem' }}
        />
    </NavContainer>
);

const X = ({ onClick }) => {
    const Container = styled.div`
        position: fixed;
        top: 10px;
        right: 15px;
        font-size: 36px;
        width: 30px;
        height: 30px;
        text-align: center;
        font-family: Arial, 'Open Sans';
    `;

    return <Container onClick={onClick}>X</Container>;
};

export default class NavMobile extends Component {
    constructor() {
        super();
        this.state = {
            isOpen: false
        };
    }

    handleOpenMenu() {
        this.setState({
            isOpen: true
        });
    }

    handleCloseMenu() {
        this.setState({
            isOpen: false
        });
    }

    render() {
        const { isOpen } = this.state;

        if (isOpen) {
            return <Nav onClick={this.handleCloseMenu.bind(this)} />;
        }

        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '10px',
                    marginRight: '15px'
                }}
            >
                <Burger onClick={this.handleOpenMenu.bind(this)} />
            </div>
        );
    }
}
