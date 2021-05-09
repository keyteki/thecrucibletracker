import React from 'react';
import { TextField, Button, Checkbox, Tooltip } from '@material-ui/core';
import Container from 'Components/ContainerFull';
import Background from 'Components/Background';
import Link from 'Components/Link';
import Deck from 'Components/Deck';
import _ from 'lodash';
import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/InfoOutlined';

const Leaderboard = ({ name, decks, previousVersion, isMobile }) => (
    <div>
        <div
            style={{
                fontSize: '26px',
                marginLeft: isMobile ? '2rem' : '',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            <div>
                {name}
                <Tooltip
                    title='Data from last 6 months for decks with 40+ games. Noted changes in elo cover the last 24 hours of play. Updates every 10 minutes.'
                    arrow
                    style={{ margin: '0 0 0 0.5rem' }}
                >
                    <InfoIcon fontSize='small' />
                </Tooltip>
            </div>
            <div>
                <Link text='Super Tournament' url='/tournaments' />
            </div>
        </div>
        {decks.map((deck, i) => {
            let previous = _.find(previousVersion, { id: deck.id });
            let previousColor;
            let previousDiff;
            if (previous) {
                if (previous.elo === deck.elo) {
                    previous = null;
                } else {
                    previousColor = '#555';
                    previousDiff = deck.elo - previous.elo;
                }
            }
            if (i < 3) {
                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'center' : '',
                            flexDirection: isMobile ? 'column' : 'row',
                            marginBottom: isMobile ? '2rem' : '2rem'
                        }}
                        key={i}
                    >
                        <div
                            style={{
                                margin: isMobile ? '0 0 1rem 0' : '',
                                width: isMobile ? 'calc(100vw - 10%)' : ''
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex'
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '20px'
                                    }}
                                >
                                    {`#${i + 1}`}
                                </div>
                                <div
                                    style={{
                                        fontSize: '20px',
                                        marginLeft: '0.5rem'
                                    }}
                                >
                                    <Link
                                        newTab
                                        text={deck.player}
                                        url={`/users/${deck.player}/decks/${deck.deckID}`}
                                    />
                                    <div
                                        style={{
                                            fontSize: '16px',
                                            color: '#555',
                                            margin: '0.75rem 0 0 0'
                                        }}
                                    >
                                        Deck
                                    </div>
                                    <Link
                                        newTab
                                        text={deck.name}
                                        url={`https://keyforgegame.com/deck-details/${deck.deckID}`}
                                    />
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ marginRight: '3rem' }}>
                                            <div
                                                style={{
                                                    fontSize: '16px',
                                                    color: '#555',
                                                    margin: '0.75rem 0 0 0'
                                                }}
                                            >
                                                Elo
                                            </div>
                                            <div>
                                                {deck.elo}
                                                {previous && (
                                                    <span
                                                        style={{
                                                            fontSize: '12px',
                                                            marginLeft: '0.25rem',
                                                            color: previousColor
                                                        }}
                                                    >
                                                        {`${
                                                            previousDiff > 0 ? '+' : ''
                                                        }${previousDiff}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '16px',
                                                    color: '#555',
                                                    margin: '0.75rem 0 0 0'
                                                }}
                                            >
                                                Record
                                            </div>
                                            <div>{`${deck.wins} - ${deck.losses}`}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a
                            href={`https://keyforgegame.com/deck-details/${deck.deckID}`}
                            target='_blank'
                            rel='noreferrer'
                        >
                            <Deck uuid={deck.deckID} isMobile={isMobile} height={500} width={357} />
                        </a>
                    </div>
                );
            }

            if (isMobile) {
                return (
                    <div
                        style={{
                            background: i % 2 === 1 ? '#EEE' : '',
                            padding: '0.75rem 0.5rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ margin: '0 1rem' }}>{`#${i + 1}`}</div>
                            {deck.player === 'anonymous' ? (
                                <div>{deck.player}</div>
                            ) : (
                                <Link
                                    newTab
                                    text={deck.player}
                                    url={`/users/${deck.player}/deck-details/${deck.deckID}`}
                                />
                            )}
                        </div>
                        <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                            {deck.player !== 'anonymous' && (
                                <Link
                                    newTab
                                    text={deck.name}
                                    url={`https://keyforgegame.com/deck-details/${deck.deckID}`}
                                />
                            )}
                            <div style={{ width: '110px', margin: '0' }}>
                                {`Elo: ${deck.elo}`}
                                {previous && (
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            marginLeft: '0.25rem',
                                            color: previousColor
                                        }}
                                    >
                                        {`${previousDiff > 0 ? '+' : ''}${previousDiff}`}
                                    </span>
                                )}
                            </div>
                            <div
                                style={{ width: '140px' }}
                            >{`Record: ${deck.wins} - ${deck.losses}`}</div>
                        </div>
                    </div>
                );
            }

            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: i % 2 === 1 ? '#EEE' : '',
                        padding: '0.75rem 0.5rem'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '1rem' }}>{`#${i + 1}`}</div>
                        {deck.player === 'anonymous' ? (
                            <div>{deck.player}</div>
                        ) : (
                            <>
                                <Link
                                    newTab
                                    text={deck.player}
                                    url={`/users/${deck.player}/decks/${deck.deckID}`}
                                />
                                <div
                                    style={{
                                        fontSize: '16px',
                                        color: '#555',
                                        margin: '0 0.5rem'
                                    }}
                                >
                                    with
                                </div>
                                <Link
                                    newTab
                                    text={deck.name}
                                    url={`https://keyforgegame.com/deck-details/${deck.deckID}`}
                                />
                            </>
                        )}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <div style={{ width: '110px', margin: '0 2rem' }}>
                            {`Elo: ${deck.elo}`}
                            {previous && (
                                <span
                                    style={{
                                        fontSize: '12px',
                                        marginLeft: '0.25rem',
                                        color: previousColor
                                    }}
                                >
                                    {`${previousDiff > 0 ? '+' : ''}${previousDiff}`}
                                </span>
                            )}
                        </div>
                        <div
                            style={{ width: '140px' }}
                        >{`Record: ${deck.wins} - ${deck.losses}`}</div>
                    </div>
                </div>
            );
        })}
    </div>
);

class Leaderboards extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        fetch('/api/leaderboards')
            .then((res) => res.json())
            .then(({ leaderboards }) => {
                this.setState({
                    leaderboard: leaderboards[0],
                    loading: false
                });
            });
    }

    render() {
        const { leaderboard, loading } = this.state;
        const { isMobile } = this.props;

        if (loading) {
            return (
                <Container width='calc(100% - 3rem)' margin='1.5rem'>
                    Loading
                </Container>
            );
        }

        return (
            <div
                style={{
                    maxWidth: '52rem',
                    margin: '5rem auto 2rem'
                }}
            >
                <Background />
                <Leaderboard {...leaderboard} isMobile={isMobile} />
            </div>
        );
    }
}

export default Leaderboards;
