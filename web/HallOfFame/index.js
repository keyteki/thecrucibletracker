import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Loading from './Loading';
import ContainerFull from '../Components/ContainerFull';
import getS3Image from '../getS3Image';
import CotA from '../../expansions/CotA';
import AoA from '../../expansions/AoA';
import WC from '../../expansions/WC';
import MM from '../../expansions/MM';
import DT from '../../expansions/DT';

class Screen extends Component {
    constructor() {
        super();
        this.state = {
            cardPlayData: null,
            set: ['479'],
            house: 'logos',
            cardType: ''
        };

        try {
            const set = localStorage.getItem('hallOfFame-set');
            if (set) {
                this.state.set = localStorage.getItem('hallOfFame-set').split(',');
            }
            const cardType = localStorage.getItem('hallOfFame-cardType');
            if (cardType) {
                this.state.cardType = localStorage.getItem('hallOfFame-cardType');
            }
            const house = localStorage.getItem('hallOfFame-house');
            if (house) {
                this.state.house = localStorage.getItem('hallOfFame-house');
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleChangeSet(e) {
        try {
            localStorage.setItem('hallOfFame-set', e.target.value);
        } catch (e) {
            console.log(e);
        }

        this.setState({
            set: e.target.value.split(',')
        });
    }

    handleChangeHouse(e) {
        try {
            localStorage.setItem('hallOfFame-house', e.target.value);
        } catch (e) {
            console.log(e);
        }

        this.setState({
            house: e.target.value
        });
    }

    handleChangeCardType(e) {
        try {
            localStorage.setItem('hallOfFame-cardType', e.target.value);
        } catch (e) {
            console.log(e);
        }

        this.setState({
            cardType: e.target.value
        });
    }

    componentDidMount(prevProps, prevState, snapshot) {
        fetch('/api/cards')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    cardPlayData: data
                });
            });
    }

    render() {
        if (!this.state.cardPlayData) {
            return (
                <ContainerFull width='100%'>
                    <Loading />
                </ContainerFull>
            );
        }

        let houseOrder = [
            'saurian',
            'staralliance',
            'mars',
            'logos',
            'dis',
            'shadows',
            'untamed',
            'sanctum',
            'brobnar'
        ];

        if (this.state.set === 435) {
            houseOrder = ['brobnar', 'untamed', 'logos', 'dis', 'mars', 'shadows', 'sanctum'];
        }

        const getCardData = (id) => {
            const dt = _.find(DT.cards, { id }) || {};
            const mm = _.find(MM.cards, { id }) || {};
            const wc = _.find(WC.cards, { id }) || {};
            const aoa = _.find(AoA.cards, { id }) || {};
            const cota = _.find(CotA.cards, { id }) || {};

            const output = {
                ...cota,
                ...aoa,
                ...wc,
                ...mm,
                ...dt,
                expansion: _.flatten([
                    dt.expansion,
                    mm.expansion,
                    wc.expansion,
                    aoa.expansion,
                    cota.expansion
                ]).filter((v) => v)
            };
            return output;
        };

        let cards = Object.keys(this.state.cardPlayData).sort((a, b) => {
            const dataA = getCardData(a);
            const dataB = getCardData(b);

            const houseIndexA = houseOrder.indexOf(dataA.house);
            const houseIndexB = houseOrder.indexOf(dataB.house);

            const indexOfAA = dataA.number.indexOf('A');
            const indexOfAB = dataB.number.indexOf('A');

            if (indexOfAA !== -1 && indexOfAB === -1) {
                return 1;
            }
            if (indexOfAA === -1 && indexOfAB !== -1) {
                return -1;
            }

            if (houseIndexA !== houseIndexB) {
                return houseIndexA - houseIndexB;
            }

            return this.state.cardPlayData[a].order - this.state.cardPlayData[b].order;
        });

        cards = cards.filter((card) => {
            const cardData = getCardData(card);

            if (this.state.house === 'anomaly' && cardData.number.indexOf('A') !== -1) {
                return true;
            }

            if (this.state.house && this.state.house !== cardData.house) {
                return false;
            }

            if (this.state.cardType.length && this.state.cardType !== cardData.type) {
                return false;
            }

            console.log(cardData);
            let { set } = this.state;
            if (!Array.isArray(set)) {
                set = [set];
            }
            for (let i = 0; i < cardData.expansion.length; i++) {
                if (set.includes(`${cardData.expansion[i]}`)) {
                    return true;
                }
            }
            return false;
        });

        const cardEls = [];
        for (let i = 0; i < cards.length; i += 1) {
            cardEls.push(
                <div
                    key={`${i}cards`}
                    style={{
                        display: 'flex',
                        margin: '10px 0',
                        justifyContent: 'space-between',
                        width: '460px',
                        overflow: 'hidden'
                    }}
                >
                    {[i].map((index) => {
                        const card = cards[index];

                        if (!card) return null;

                        let filename = card.replace(/ /g, '_').replace('?', '');
                        if (filename === 'dark-æmber-vault') {
                            filename = 'dark-æmber-vault-untamed';
                        }

                        const firstPlayer = this.state.cardPlayData[card].topPlayers[0].player;
                        const firstPlayerEl =
                            firstPlayer === 'anonymous' ? (
                                <div style={{ fontSize: '16px' }}>
                                    {this.state.cardPlayData[
                                        card
                                    ].topPlayers[0].count.toLocaleString()}
                                    {` for ${this.state.cardPlayData[card].topPlayers[0].player}`}
                                </div>
                            ) : (
                                <div style={{ fontSize: '16px' }}>
                                    <a
                                        style={{ textDecoration: 'none' }}
                                        href={`/users/${firstPlayer}`}
                                    >
                                        {this.state.cardPlayData[card].topPlayers[0].player}
                                    </a>
                                    {' at '}
                                    {this.state.cardPlayData[
                                        card
                                    ].topPlayers[0].count.toLocaleString()}
                                    {' plays'}
                                </div>
                            );

                        return (
                            <div key={card} style={{ display: 'flex', padding: '10px' }}>
                                <img
                                    style={{ width: '220px', height: '308px' }}
                                    src={getS3Image(filename, 'card')}
                                />
                                <div style={{ marginLeft: '20px' }}>
                                    <div style={{ fontSize: '22px', marginTop: '10px' }}>
                                        {getCardData(card).name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginTop: '20px'
                                        }}
                                    >
                                        MOST PLAYS BY
                                    </div>
                                    {firstPlayerEl}
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginTop: '20px'
                                        }}
                                    >
                                        MORE RANKINGS
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            fontSize: '12px',
                                            marginTop: '2px'
                                        }}
                                    >
                                        {this.state.cardPlayData[card].topPlayers
                                            .slice(1, 9)
                                            .map(({ player, count }, j) => {
                                                if (player === 'anonymous') {
                                                    return (
                                                        <div
                                                            style={{
                                                                marginBottom: '5px',
                                                                color: '#AAA'
                                                            }}
                                                            key={j}
                                                        >
                                                            {`${count.toLocaleString()} for ${player}`}
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div
                                                        style={{
                                                            marginBottom: '5px'
                                                        }}
                                                        key={j}
                                                    >
                                                        {`${count.toLocaleString()} for `}
                                                        <a
                                                            style={{ textDecoration: 'none' }}
                                                            target='_blank'
                                                            href={`/users/${player}`}
                                                            rel='noreferrer'
                                                        >
                                                            {player}
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        let setName = 'Call of the Archons';
        if (this.state.set.includes(435) || this.state.set.includes('435')) {
            setName = 'Age of Ascension';
        }
        if (this.state.set.includes(452) || this.state.set.includes('452')) {
            setName = "World's Collide";
        }

        return (
            <ContainerFull width='100%' padding='0'>
                <div style={{ margin: '10px 10px 10px 20px' }}>
                    <div style={{ fontSize: '34px' }}>Hall of Fame</div>
                    <div
                        style={{
                            display: 'flex',
                            marginTop: '20px',
                            marginBottom: '40px'
                        }}
                    >
                        <FormControl style={{ minWidth: '100px', marginRight: '20px' }}>
                            <InputLabel>Expansion</InputLabel>
                            <Select
                                value={this.state.set.join(',')}
                                onChange={this.handleChangeSet.bind(this)}
                            >
                                <MenuItem value='496'>Dark Tidings</MenuItem>
                                <MenuItem value='479'>Mass Mutation</MenuItem>
                                <MenuItem value='452,453'>World's Collide</MenuItem>
                                <MenuItem value='435'>Age of Ascension</MenuItem>
                                <MenuItem value='341'>Call of the Archons</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl style={{ minWidth: '100px', marginRight: '20px' }}>
                            <InputLabel>House</InputLabel>
                            <Select
                                value={this.state.house}
                                onChange={this.handleChangeHouse.bind(this)}
                            >
                                <MenuItem value=''>All</MenuItem>
                                <MenuItem value='unfathomable'>Unfathomable</MenuItem>
                                <MenuItem value='dis'>Dis</MenuItem>
                                <MenuItem value='logos'>Logos</MenuItem>
                                <MenuItem value='mars'>Mars</MenuItem>
                                <MenuItem value='sanctum'>Sanctum</MenuItem>
                                <MenuItem value='saurian'>Saurian</MenuItem>
                                <MenuItem value='staralliance'>Star Alliance</MenuItem>
                                <MenuItem value='shadows'>Shadows</MenuItem>
                                <MenuItem value='untamed'>Untamed</MenuItem>
                                <MenuItem value='brobnar'>Brobnar</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl style={{ minWidth: '100px', marginRight: '20px' }}>
                            <InputLabel>Card Type</InputLabel>
                            <Select
                                value={this.state.cardType}
                                onChange={this.handleChangeCardType.bind(this)}
                            >
                                <MenuItem value=''>All</MenuItem>
                                <MenuItem value='action'>Action</MenuItem>
                                <MenuItem value='artifact'>Artifact</MenuItem>
                                <MenuItem value='creature'>Creature</MenuItem>
                                <MenuItem value='upgrade'>Upgrade</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between'
                        }}
                    >
                        {cardEls.length === 0 ? <div>No cards found</div> : cardEls}
                    </div>
                </div>
            </ContainerFull>
        );
    }
}

export default Screen;
