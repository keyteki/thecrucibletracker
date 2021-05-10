import React, { Component } from 'react';
import Skeletons from '../Deck/Skeletons';
import './index.css';
import StartingHands from './StartingHands';
import Summary from './Summary';
import Log from './Log';
import Container from '../Components/ContainerFull';
import Replay from './Replay';

class GameLogScreen extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount(prevProps, prevState, snapshot) {
        if (!this.props.gameID) {
            return;
        }
        Promise.all([
            fetch(`/api/games/${this.props.gameID}`).then((response) => response.json()),
            fetch(`/api/games/${this.props.gameID}/log`).then((response) => response.json()),
            fetch(`/api/games/${this.props.gameID}/board`).then((response) => response.json()),
            fetch(`/api/games/${this.props.gameID}/hands`).then((response) => response.json())
        ]).then((values) => {
            this.setState({
                game: values[0],
                log: values[1],
                boards: values[2],
                hands: values[3]
            });
        });
    }

    render() {
        const { game, log, boards, hands } = this.state;

        if (!game || !log || !boards || !hands) {
            return (
                <Container width='100%' padding='0'>
                    <Skeletons />
                </Container>
            );
        }

        const url = new URL(window.location.href);
        if (url.searchParams.get('replay')) {
            return (
                <Container width='unset'>
                    <div className='game-log-screen'>
                        <Summary game={game} />
                        {hands && Object.keys(hands).length > 0 && <StartingHands hands={hands} />}
                        <div style={{ margin: '3rem 0' }}>
                            <Replay uuid={game.crucible_game_id} />
                        </div>
                    </div>
                </Container>
            );
        }

        return (
            <Container width='unset'>
                <div className='game-log-screen'>
                    <Summary game={game} />
                    {hands && Object.keys(hands).length > 0 && <StartingHands hands={hands} />}
                    <br />
                    <br />
                    <Log game={game} log={log} boards={boards} />
                </div>
            </Container>
        );
    }
}

export default GameLogScreen;
