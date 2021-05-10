import React, { Component } from 'react';
import Card from './Card';
import sanitizeCardName from '../../../sanitize-card-name';
import getS3Image from '../../getS3Image';
import setData from '../../set-data';

class Player extends Component {
    render() {
        const { board, hand, archives, position, playerName, amber, keys } = this.props;
        const archiveCards = archives ? Object.values(archives) : [];

        const cards = Object.values(board || {});
        let handCards = Object.values(hand || {});
        try {
            handCards = handCards.sort((a, b) => {
                if (a === '' && b === '') return 0;
                if (a === '') return -1;
                if (b === '') return 1;
                const cardA = setData[sanitizeCardName(a)];
                const cardB = setData[sanitizeCardName(b)];

                const houseA = cardA.house || cardA.printedHouse;
                const houseB = cardB.house || cardB.printedHouse;

                return houseA.localeCompare(houseB);
            });
        } catch (e) {
            console.log(e);
        }

        const creatures = cards.filter((card) => card.type === 'creature');
        const artifacts = cards.filter((card) => card.type === 'artifact');

        let maxUpgrades = 0;
        creatures.forEach((c) => {
            maxUpgrades = Math.max(maxUpgrades, (c.upgrades || []).length);
        });

        let creaturesEl = (
            <div
                style={{
                    display: 'flex',
                    padding: '10px'
                }}
            >
                {creatures.map((card, i) => (
                    <Card
                        name={card.name}
                        upgrades={card.upgrades || []}
                        ready={!card.exhausted}
                        armor={card.tokens.armor || 0}
                        damage={card.tokens.damage || 0}
                        power={card.tokens.power || 0}
                        amber={card.tokens.amber || 0}
                        ward={card.tokens.ward || 0}
                        stunned={card.stunned || false}
                        enrage={card.tokens.enrage || 0}
                        key={playerName + card.name + i}
                        maxUpgradesOfNeighbors={
                            (card.upgrades || []).length === maxUpgrades ? 0 : maxUpgrades
                        }
                    />
                ))}
            </div>
        );

        if (creatures.length === 0) {
            creaturesEl = <div style={{ height: '88px' }} />;
        }

        let artifactsEl = (
            <div
                style={{
                    display: 'flex',
                    padding: '10px'
                }}
            >
                {artifacts.map((card, i) => (
                    <Card
                        name={card.name}
                        upgrades={[]}
                        armor={card.tokens.armor || 0}
                        damage={card.tokens.damage || 0}
                        amber={card.tokens.amber || 0}
                        ward={card.tokens.ward || 0}
                        stunned={card.stunned || false}
                        enrage={card.tokens.enrage || 0}
                        key={playerName + card.name + i}
                        maxUpgradesOfNeighbors={0}
                    />
                ))}
            </div>
        );

        if (artifacts.length === 0) {
            artifactsEl = <div style={{ height: '88px' }} />;
        }

        let handEl = (
            <div
                style={{
                    padding: '5px 10px',
                    backgroundColor: 'rgba(119, 136, 153, 0.3)',
                    minHeight: '120px'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '0 5px 0px 5px'
                    }}
                >
                    <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                        {playerName}
                        {Number.isFinite(amber) && (
                            <img src={getS3Image('aember')} style={{ width: '25px' }} />
                        )}
                        {Number.isFinite(keys) && keys > 0 && (
                            <img src={getS3Image('key')} style={{ width: '25px' }} />
                        )}
                        {Number.isFinite(keys) && keys > 1 && (
                            <img src={getS3Image('key')} style={{ width: '25px' }} />
                        )}
                        {Number.isFinite(keys) && keys > 2 && (
                            <img src={getS3Image('key')} style={{ width: '25px' }} />
                        )}
                    </div>
                    {!!archiveCards.length && <div style={{ fontSize: '11px' }}>Archive</div>}
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            position: 'relative'
                        }}
                    >
                        {handCards.map((card, i) => (
                            <div
                                style={{
                                    position: handCards.length > 8 ? 'absolute' : null,
                                    left: handCards.length > 8 ? `${i * 50}px` : null,
                                    zIndex: i + handCards.length,
                                    paddingLeft:
                                        handCards.length > 8
                                            ? i === handCards.length - 1
                                                ? '25px'
                                                : null
                                            : null
                                }}
                                key={`${playerName}hand${card}${i}`}
                            >
                                <Card
                                    name={card}
                                    upgrades={[]}
                                    armor={0}
                                    damage={0}
                                    amber={0}
                                    ward={0}
                                    stunned={false}
                                    enrage={0}
                                    maxUpgradesOfNeighbors={0}
                                />
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            position: 'relative'
                        }}
                    >
                        {archiveCards.map((card, i) => (
                            <div
                                style={{
                                    position: 'absolute',
                                    right: `${i * 20}px`,
                                    zIndex: -i + archiveCards.length,
                                    paddingLeft: i === archiveCards.length - 1 ? '10px' : null,
                                    borderLeft:
                                        i === archiveCards.length - 1 ? '2px dashed #ccc' : null
                                }}
                                key={`archives-${card}-${i}`}
                            >
                                <Card
                                    name={card}
                                    upgrades={[]}
                                    armor={0}
                                    damage={0}
                                    amber={0}
                                    ward={0}
                                    stunned={false}
                                    enrage={0}
                                    maxUpgradesOfNeighbors={0}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        if (handCards.length === 0) {
            handEl = null;
        }

        return (
            <div style={{}}>
                {position === 'top' ? (
                    <div style={{ marginTop: '0px' }}>
                        {handEl}
                        {artifactsEl}
                        {creaturesEl}
                    </div>
                ) : (
                    <div style={{ marginBottom: '0px' }}>
                        {creaturesEl}
                        {artifactsEl}
                        {handEl}
                    </div>
                )}
            </div>
        );
    }
}

export default Player;
