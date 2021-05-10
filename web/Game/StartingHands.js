import React, { Component } from 'react';
import Skeleton from 'react-skeleton-loader';
import CardInHand from './CardInHand';
import sanitizeCardName from '../../sanitize-card-name';
import setData from '../set-data';

class StartingHands extends Component {
    render() {
        const { hands } = this.props;

        if (!hands) {
            return (
                <div style={{}}>
                    <div style={{ fontSize: '20px' }}>Starting Hands</div>
                    <Skeleton animated={false} borderRadius={0} width='100%' height='200px' />
                    <Skeleton animated={false} borderRadius={0} width='100%' height='100px' />
                </div>
            );
        }

        return (
            <div style={{}}>
                <div style={{ fontSize: '20px' }}>Starting Hands</div>
                {Object.keys(hands).map((player) => {
                    const playerHands = hands[player];
                    const playerCardsInHand = Object.values(playerHands).sort(
                        (a, b) => b.length - a.length
                    );

                    return (
                        <div key={player}>
                            {playerCardsInHand.slice(0, 2).map((cards, i) => {
                                try {
                                    cards = cards.sort((a, b) => {
                                        const cardA = setData[sanitizeCardName(a.name)];
                                        const cardB = setData[sanitizeCardName(b.name)];

                                        const houseA = cardA.house || cardA.printedHouse;
                                        const houseB = cardB.house || cardB.printedHouse;

                                        return houseA.localeCompare(houseB);
                                    });
                                } catch (e) {
                                    console.log(e);
                                }

                                return (
                                    <div key={player + i}>
                                        <div style={{ padding: '5px', fontSize: '18px' }}>
                                            {player} {i === 0 ? '' : 'mulliganed into'}
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            {cards.map((card, j) => (
                                                <div
                                                    style={{ margin: '0 2px' }}
                                                    key={`card-in-hand-${j}`}
                                                >
                                                    <CardInHand name={card.name} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default StartingHands;
