import React, {
  Component,
  Fragment,
} from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import getS3Image from '../getS3Image';
import expansions from '../../expansions';
import setData from '../set-data';

class Deck extends Component {
  constructor() {
    super();
    this.state = {
      cards: [],
      wholeImageLoaded: false,
      numLoaded: 0,
    };
  }

  componentDidMount(prevProps, prevState, snapshot) {
    const {
      uuid,
      isMobile,
    } = this.props;

    if (isMobile) return;

    // const url = `/api/decks/${uuid}/cards`;
    // fetch(url)
    // .then((response) => response.json())
    // .then((cards) => {
    // cards = cards.sort((a, b) => {
    // try {
    // const cardA = setData[a.name];
    // const cardB = setData[b.name];

    // if (!a.house) {
    // return 1;
    // } if (!b.house) {
    // return -1;
    // }

    // if (a.house < b.house) {
    // return -1;
    // } if (a.house > b.house) {
    // return 1;
    // }

    // if (cardA.type === cardB.type) {
    // return cardA.name.localeCompare(cardB.name);
    // }

    // return cardA.type.localeCompare(cardB.type);
    // } catch (e) {
    // console.log(e);
    // return 0;
    // }
    // });

    // this.setState({
    // cards,
    // });
    // });
  }

  render() {
    const { uuid, expansion, isMobile } = this.props;
    const { cards, numLoaded, wholeImageLoaded } = this.state;
    const height = this.props.height || 840;
    const width = this.props.width || 600;

    // if (isMobile) {
    return (
      <img
        src={`/api/decks/${uuid}/image`}
        style={{ height: `${height}px`, width: `${width}px` }}
      />
    );
    // }

    if (_.isEmpty(cards) || cards.length < 36) {
      return null;
    }

    return (
      <>
        { expansion === expansions.mm
          && (
          <img
            src={`/api/decks/${uuid}/image`}
            style={{ height: `${height}px`, display: wholeImageLoaded ? '' : 'none' }}
            onLoad={() => this.setState({ wholeImageLoaded: true })}
          />
          )}

        { !wholeImageLoaded && (
        <a
          href={`/decks/${uuid}`}
          rel="noreferrer noopener"
          target="_blank"
          style={{
            height: `${height}px`,
            width: `${width}px`,
            display: 'flex',
            flexFlow: 'wrap',
            background: numLoaded === 36 ? '#444' : '#AAA',
          }}
        >
          {cards.map((card, i) => (
            <img
              key={i}
              src={getS3Image(card.id, 'card')}
              style={{
                width: `${width / 6}px`,
                visibility: numLoaded === 36 ? '' : 'hidden'
              }}
              onLoad={() => this.setState({ numLoaded: numLoaded + 1 })}
            />
          ))}
        </a>
        )}
      </>
    );
  }
}

export default Deck;
