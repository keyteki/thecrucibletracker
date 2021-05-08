import React, { Component, } from 'react';
import setData from '../set-data';
import sanitizeCardName from '../../sanitize-card-name';
import getS3Image from '../getS3Image';

function FullCard(filename) {
  return (
    <div style={{
      borderRadius: '5px',
      height: '236px',
      overflow: 'hidden',
    }}
    >
      <img
        src={getS3Image(filename, 'card')}
        style={{
          padding: 0,
          margin: '-1px 0 0 -1px',
          width: '150px',
        }}
      />
    </div>
  );
}

function BottomCroppedCard(filename, height) {
  return (
    <div style={{
      borderRadius: '5px',
      height,
      overflow: 'hidden',
      position: 'relative',
    }}
    >
      <img
        src={getS3Image(filename, 'card')}
        style={{
          padding: 0,
          margin: '-1px 0 0 -1px',
          width: '150px',
        }}
      />
    </div>
  );
}

function Creature(filename) {
  return BottomCroppedCard(filename, '132px');
}

function Artifact(filename) {
  return BottomCroppedCard(filename, '140px');
}

function Action(filename) {
  return BottomCroppedCard( filename, '122px');
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, };
  }

  componentDidCatch(error, info) {
    console.log('error', error);
    this.setState({ hasError: true, });
  }

  render() {
    const {
      name,
      action,
      line,
    } = this.props;

    if (this.state.hasError) {
      return line || null;
    }

    const card = setData[sanitizeCardName(name)];

    if (!card || !card.type) {
      return line || null;
    }

    const filename = card.id;

    const images = {
      creature: Creature(filename),
      artifact: Artifact(filename),
      action: Action(filename),
      upgrade: Creature(filename),
    };

    const image = images[card.type] || FullCard(filename);

    return (
      <div style={{
        display: 'flex',
      }}
      >
        {action && (
        <div style={{
          height: '20px',
          fontSize: '15px',
          borderRadius: '2px',
          display: 'inline-block',
          padding: '5px 5px 5px 0',
          color: 'black',
          marginTop: '10px',
          marginRight: '5px',
          minWidth: '48px',
          textAlign: 'left',
        }}
        >
          {action}
        </div>
        )}
        {image}
      </div>
    );
  }
}

export default Card;
