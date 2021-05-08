import React, { Component, useState, } from 'react';
import setData from '../../set-data';
import sanitizeCardName from '../../../sanitize-card-name';
import getS3Image from '../../getS3Image';

function BottomCroppedCard({ name, filename, }) {
  const [ isShown, setIsShown, ] = useState(false);

  if (filename === 'cardback') {
    return (
      <div style={{ display: 'flex', }}>
        <span style={{
          height: '88px',
          borderRadius: '5px',
          borderBottomLeftRadius: '3px',
          borderBottomRightRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
        }}
        >
          <img
            src={getS3Image(filename, 'card')}
            style={{
              padding: 0,
              margin: '-1px 0 0 -1px',
              width: '100px',
            }}
          />
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ display: 'flex', }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {isShown && (
        <img
          src={getS3Image(filename, 'card')}
          style={{
            padding: '0px',
            width: '200px',
            zIndex: 100,
            margin: '-290px -50px 0px',
            position: 'absolute',
          }}
        />
      )}
      <div style={{
        height: '88px',
        borderRadius: '5px',
        borderBottomLeftRadius: '3px',
        borderBottomRightRadius: '3px',
        overflow: 'hidden',
        position: 'relative',
      }}
      >
        <img
          src={getS3Image(filename, 'card')}
          style={{
            padding: 0,
            margin: '-1px 0 0 -1px',
            width: '100px',
          }}
        />
      </div>
    </div>
  );
}

function Token(type, amount, position) {
  const [ top, left ] = position;

  return (
    <div style={{
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
    }}
    >
      <img
        style={{
          position: 'absolute',
          width: '30px',
          marginLeft: '4px',
        }}
        src={getS3Image(type)}
      />
      {amount && (
      <div style={{
        position: 'absolute',
        left: type === 'power' ? '18px' : '15px',
        top: '3px',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: '22px',
        color: 'white',
        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
      }}
      >
        {amount}
      </div>
      )}
    </div>
  );
}

class Card extends Component {
  render() {
    const {
      name,
      upgrades,
      ready,
      armor,
      damage,
      ward,
      enrage,
      stunned,
      amber,
      power,
      maxUpgradesOfNeighbors,
    } = this.props;

    let card;
    if (!name || !name.length) {
      card = {};
    }

    card = card || setData[sanitizeCardName(name)];
    let filename = card.id;

    if (!filename) {
      filename = 'cardback';
    }
    const image = <BottomCroppedCard name={name} filename={filename} />;

    const numTokens = [ !!armor, !!damage, !!ward, !!enrage, stunned, !!amber, !!power ].filter((b) => b).length;
    let tokenPositions = [];

    switch (numTokens) {
      case 1:
        tokenPositions = [
          [ 30, 30, ],
        ];
        break;
      case 2:
        tokenPositions = [
          [ 30, 10, ],
          [ 30, 50, ],
        ];
        break;
      case 3:
        tokenPositions = [
          [ 30, 0, ],
          [ 30, 30, ],
          [ 30, 60, ],
        ];
        break;
      case 4:
        tokenPositions = [
          [ 10, 10, ],
          [ 10, 50, ],
          [ 50, 10, ],
          [ 50, 50, ],
        ];
        break;
      case 5:
        tokenPositions = [
          [ 0, 10, ],
          [ 0, 50, ],
          [ 30, 10, ],
          [ 30, 50, ],
          [ 60, 10, ],
        ];
        break;
      case 6:
        tokenPositions = [
          [ 0, 10, ],
          [ 0, 50, ],
          [ 30, 10, ],
          [ 30, 50, ],
          [ 60, 10, ],
          [ 60, 50, ],
        ];
        break;
      case 7:
        tokenPositions = [
          [ 0, 10, ],
          [ 0, 50, ],
          [ 30, 10, ],
          [ 30, 50, ],
          [ 60, 10, ],
          [ 60, 50, ],
          [ 90, 30, ],
        ];
    }

    tokenPositions = tokenPositions.map((p) => [ p[0] + upgrades.length * 20, p[1], ]);

    const rotation = ready ? 'none' : 'rotation(90px)';
    const height = 88 + upgrades.length * 20;
    let marginTop = 5;
    if (maxUpgradesOfNeighbors) {
      marginTop += maxUpgradesOfNeighbors * 20;
    }

    return (
      <div style={{
        display: 'flex',
        flexShrink: 0,
        position: 'relative',
        boxShadow: 'rgba(0, 0, 0, 0.2) 2px 2px 5px 0px',
        margin: '2px',
        transform: rotation,
        width: '99px',
        height: `${height}px`,
        marginTop,
      }}
      >
        {upgrades.map((upgrade, i) => {
          const top = `${i * 20}px`;
          return (
            <div
              key={upgrade.uuid || `upgrade-${i}-${upgrade.name}`}
              style={{
                top,
                display: 'flex',
                position: 'absolute',
              }}
            >
              <BottomCroppedCard name={upgrade.name} filename={upgrade.id} />
            </div>
          );
        })}
        <div style={{
          top: `${upgrades.length * 20}px`,
          position: 'absolute',
        }}
        >
          {image}
        </div>
        {armor > 0 && Token('armor', armor, tokenPositions.shift())}
        {damage > 0 && Token('damage', damage, tokenPositions.shift())}
        {amber > 0 && Token('amber', amber, tokenPositions.shift())}
        {power > 0 && Token('power', power, tokenPositions.shift())}
        {ward > 0 && Token('ward', null, tokenPositions.shift())}
        {enrage > 0 && Token('enrage', null, tokenPositions.shift())}
        {stunned && Token('stun', null, tokenPositions.shift())}
      </div>
    );
  }
}

export default Card;
