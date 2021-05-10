import React, { Component } from 'react';
import Skeleton from 'react-skeleton-loader';
import CardInGame from './CardInGame';
import Board from './Board';

const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const scrollToHash = (hash) => {
    if (hash) {
        const el = document.querySelector(`${hash}`);
        if (el) {
            window.scrollTo({
                top: el.getBoundingClientRect().top
            });
        }
    }
};

class Log extends Component {
    componentDidMount(prevProps, prevState, snapshot) {
        scrollToHash(window.location.hash);
    }

    render() {
        const { log, boards, game } = this.props;

        if (!log.length && boards.length) {
            return (
                <div>
                    {boards.map((board, i) => (
                        <div
                            key={`turn-line--${i}`}
                            style={{ marginLeft: '15px', marginTop: '10px', marginBottom: '10px' }}
                        >
                            <Board data={board} />
                        </div>
                    ))}
                </div>
            );
        }

        if (log.length === 0) {
            return (
                <div>
                    {new Array(10).fill(0).map((n, i) => (
                        <div key={i} style={{ marginBottom: '30px' }}>
                            <Skeleton
                                animated={false}
                                borderRadius={0}
                                width='400px'
                                height='40px'
                            />
                        </div>
                    ))}
                </div>
            );
        }

        let turnInspected = 0;
        let firstTurnBorderColor = 'rgba(0, 0, 0, 0)';
        let firstTurnHeader = null;
        let firstPlayer;
        if (this.props.log) {
            const firstPlayerAction =
                this.props.log.find((log) => log.includes(' plays ')) ||
                this.props.log.find((log) => log.includes(' discards '));

            if (firstPlayerAction) {
                firstPlayer = firstPlayerAction.includes(game.winner) ? game.winner : game.loser;
                if (game.turns && game.turns[0]) {
                    firstPlayer = game.turns[0].activePlayer;
                }

                firstTurnBorderColor =
                    firstPlayer !== game.winner ? 'rgba(252, 127, 121)' : 'rgb(133, 221, 133)';
                const borderColor =
                    firstPlayer === game.winner ? 'rgb(133, 221, 133)' : 'rgba(252, 127, 121)';

                firstTurnHeader = (
                    <div
                        className='line'
                        style={{
                            borderTop: '1px dashed #ccc',
                            paddingTop: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '30px'
                        }}
                    >
                        <div
                            className='line-content'
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {firstPlayer}
                        </div>
                        <div style={{ marginRight: '5px', display: 'flex', alignItems: 'center' }}>
                            Turn 1
                        </div>
                    </div>
                );
            }
        }

        let turn = 1;
        let skipNextLine = false;
        let keys1 = 0;
        let keys2 = 0;
        let seenChooses = false;

        return (
            <div>
                {firstTurnHeader}
                {this.props.log.map((line, i) => {
                    line = line.replace(/''/g, "'").trim();
                    if (skipNextLine) {
                        skipNextLine = false;
                        return;
                    }

                    const ignoreList = [
                        /has connected to the game server$/,
                        /^Key phase/,
                        /^House phase/,
                        /^Main phase/,
                        /^Ready phase/,
                        /^Draw phase/,
                        /readies all of their cards/,
                        /readies all their cards/,
                        /does not forge a key/,
                        / won the flip /,
                        /End of turn/
                    ];
                    for (let j = 0; j < ignoreList.length; j++) {
                        const regex = ignoreList[j];
                        if (regex.test(line)) {
                            return null;
                        }

                        if (!seenChooses && / draws \d+ card/.test(line)) {
                            return null;
                        }
                    }

                    if (/chooses/.test(line)) {
                        seenChooses = true;
                    }

                    if (/ forges the/.test(line)) {
                        const firstPlayerJoinedLine = this.props.log.find(
                            (l) => l.indexOf('is playing as the Archon') !== -1
                        );
                        const playerWhoForged = line.slice(0, line.indexOf(' forges '));

                        const turnData = this.props.boards[0];
                        if (turnData) {
                            const playerNames = Object.keys(turnData.board);
                            if (playerWhoForged === playerNames[0]) {
                                keys1 += 1;
                            } else {
                                keys2 += 1;
                            }
                        }

                        line = line.replace('forgedkeyyellow', 'yellow key');
                        line = line.replace('forgedkeyred', 'red key');
                        line = line.replace('forgedkeyblue', 'blue key');

                        return (
                            <div
                                key={`line-${i}`}
                                style={{
                                    padding: '0px',
                                    marginBottom: '5px',
                                    display: 'inline-block',
                                    backgroundColor: '#fffca8'
                                }}
                                className='regular-line'
                            >
                                {line}
                            </div>
                        );
                    }

                    if (/^Turn \d+/.test(line)) {
                        line = line.replace(` - ${game.winner}`, '');
                        line = line.replace(` - ${game.loser}`, '');

                        const playerName =
                            turnInspected % 2 === 1
                                ? firstPlayer
                                : game.winner === firstPlayer
                                ? game.loser
                                : game.winner;
                        const borderColor =
                            playerName === game.winner
                                ? 'rgb(133, 221, 133)'
                                : 'rgba(252, 127, 121)';

                        const futureLogs = this.props.log.slice(i);

                        turnInspected += 1;
                        const turnData = this.props.boards.find((board) => board.turn === turn);

                        let amber1;
                        let amber2;

                        const prevLine = this.props.log[i - 1];

                        if (prevLine && /: \d+ amber .*: \d+ amber/.test(prevLine)) {
                            const prevLine1 = prevLine.slice(0, prevLine.indexOf('amber ') + 5);
                            const prevLine2 = prevLine.slice(prevLine.indexOf('amber ') + 6);

                            amber1 = prevLine1
                                .replace(new RegExp('^.*: '), '')
                                .replace(new RegExp(' \\(0 keys\\)'), '')
                                .replace(new RegExp(' \\(1 key\\)'), '')
                                .replace(new RegExp(' \\(2 keys\\)'), '')
                                .replace(new RegExp(' \\(3 keys\\)'), '')
                                .replace(new RegExp('amber'), '');

                            amber2 = prevLine2
                                .replace(new RegExp('^.*: '), '')
                                .replace(new RegExp(' \\(0 keys\\)'), '')
                                .replace(new RegExp(' \\(1 key\\)'), '')
                                .replace(new RegExp(' \\(2 keys\\)'), '')
                                .replace(new RegExp(' \\(3 keys\\)'), '')
                                .replace(new RegExp('amber'), '');

                            if (turnData) {
                                const playerNames = Object.keys(turnData.board);
                                if (prevLine2.indexOf(playerNames[0]) !== -1) {
                                    const swapAmber = amber1;
                                    amber1 = amber2;
                                    amber2 = swapAmber;
                                }
                            }
                        }

                        let board = null;
                        if (turnData && turn > 0) {
                            if (amber1 != null && amber2 != null) {
                                skipNextLine = true;
                            }

                            turn += 1;
                            board = (
                                <div key={`turn-line-${playerName}-${i}`}>
                                    <Board
                                        data={turnData}
                                        amber1={amber1}
                                        amber2={amber2}
                                        keys1={keys1}
                                        keys2={keys2}
                                    />
                                </div>
                            );
                        } else {
                            turn += 1;
                        }

                        const hash = `${firstPlayer === playerName ? 'a' : 'b'}${Math.ceil(
                            turn / 2
                        )}`;
                        return (
                            <div key={`line-${i}`}>
                                <div
                                    className='line'
                                    style={{
                                        borderTop: '1px dashed #ccc',
                                        paddingTop: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '30px'
                                    }}
                                >
                                    <div
                                        id={hash}
                                        className='line-content'
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        {playerName}
                                    </div>
                                    <div
                                        style={{
                                            marginRight: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            padding: '3px 5px',
                                            color: 'rgb(0, 0, 238)'
                                        }}
                                        onClick={() => {
                                            const url = `${window.location.origin}${window.location.pathname}#${hash}`;
                                            window.location.replace(url);
                                            copyToClipboard(url);
                                            scrollToHash(hash);
                                        }}
                                    >
                                        {line}
                                    </div>
                                </div>
                                {board !== null && board}
                            </div>
                        );
                    }

                    if (/: \d+ amber .*: \d+ amber/.test(line)) {
                        const turnData = this.props.boards.find((board) => board.turn === turn);
                        if (turnData) {
                            return null;
                        }

                        let trimmedLine = line
                            .replace(new RegExp(' \\(0 keys\\)'), '')
                            .replace(new RegExp(' \\(1 key\\)'), '')
                            .replace(new RegExp(' \\(2 keys\\)'), '')
                            .replace(new RegExp(' \\(3 keys\\)'), '');

                        trimmedLine = trimmedLine
                            .replace(new RegExp(' \\(0 keys\\)'), '')
                            .replace(new RegExp(' \\(1 key\\)'), '')
                            .replace(new RegExp(' \\(2 keys\\)'), '')
                            .replace(new RegExp(' \\(3 keys\\)'), '');
                        const line1 = trimmedLine.slice(0, trimmedLine.indexOf('amber ') + 5);
                        const line2 = trimmedLine.slice(trimmedLine.indexOf('amber ') + 6);

                        return (
                            <div
                                key={`line-${i}`}
                                style={{ marginTop: '10px', marginBottom: '10px' }}
                                className='regular-line'
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {line1}
                                    <img style={{ width: '15px' }} src='/aember.png' />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {line2}
                                    <img style={{ width: '15px' }} src='/aember.png' />
                                </div>
                            </div>
                        );
                    }

                    if (/draws \d+ cards up to their maximum hand size of \d+/.test(line)) {
                        line = line.slice(0, line.indexOf(' up to their maximum'));
                    }

                    if (turnInspected === 0 && /is shuffling their deck/.test(line)) {
                        return null;
                    }

                    if (turnInspected === 0 && /is playing as the/.test(line)) {
                        return null;
                    }

                    if (/plays/.test(line)) {
                        let card = line.slice(line.indexOf('plays') + 5);

                        if (card.indexOf(', gaining') !== -1) {
                            card = card.slice(0, card.indexOf(', gaining'));
                        }

                        if (card.indexOf('attaching it to') !== -1) {
                            card = card.slice(0, card.indexOf('attaching it to'));
                        }

                        if (/from their/.test(line)) {
                            return (
                                <div key={`line-${i}`} className='regular-line'>
                                    {line}
                                </div>
                            );
                        }
                        card = card.trim();

                        return (
                            <div
                                key={`line-${i}`}
                                className='regular-line'
                                style={{
                                    display: 'flex',
                                    marginTop: '5px',
                                    marginBottom: '10px'
                                }}
                            >
                                <div
                                    style={{
                                        marginTop: '10px',
                                        marginRight: '20px'
                                    }}
                                >
                                    Plays
                                </div>
                                <div
                                    style={{
                                        transform: 'scale(0.7)',
                                        transformOrigin: 'top left',
                                        margin: '0 0 calc(-120px * (1 - 0.7))'
                                    }}
                                >
                                    <CardInGame name={card} />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={`line-${i}`} className='regular-line'>
                            {line}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default Log;
