import React, { Component, } from 'react';
import Player from './Player';

class Board extends Component {
  render() {
    const {
      data,
      keys1,
      keys2,
      amber1,
      amber2,
    } = this.props;

    const playerNames = Object.keys(data.board);

    [
      'hand',
      'archives',
      'purged',
    ].forEach((c) => {
      data[c] = data[c] || {};
      data[c][playerNames[0]] = data[c][playerNames[0]] || {};
      data[c][playerNames[1]] = data[c][playerNames[1]] || {};
    });

    return (
      <div
        style={{
          display: 'flex',
          margin: '10px 0 50px 0',
        }}
        key={`${playerNames.join()}${amber1}${amber2}${keys1}${keys2}`}
      >
        <div style={{
          backgroundColor: 'rgb(221, 221, 221)',
          position: 'relative',
          flexGrow: 1,
          width: 'calc(100vw - 180px)',
        }}
        >
          <div style={{
            minHeight: '106px',
            marginBottom: '5px',
          }}
          >
            <Player
              board={data.board[playerNames[0]]}
              hand={data.hand[playerNames[0]]}
              archives={data.archives[playerNames[0]]}
              position="top"
              playerName={playerNames[0]}
              amber={amber1}
              keys={keys1}
            />
          </div>
          <div style={{
            borderTop: '2px dashed #AAA',
            paddingTop: '5px',
            minHeight: '106px',
          }}
          >
            <Player
              board={data.board[playerNames[1]]}
              hand={data.hand[playerNames[1]]}
              archives={data.archives[playerNames[1]]}
              position="bottom"
              playerName={playerNames[1]}
              amber={amber2}
              keys={keys2}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
