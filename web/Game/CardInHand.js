import React, { Component } from 'react';
import setData from '../set-data';
import sanitizeCardName from '../../sanitize-card-name';
import getS3Image from '../getS3Image';

function BottomCroppedCard(filename) {
    return (
        <div
            style={{
                height: '120px',
                width: '137px',
                borderRadius: '5px',
                borderBottomLeftRadius: '3px',
                borderBottomRightRadius: '3px',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <img
                src={getS3Image(filename, 'card')}
                style={{
                    padding: 0,
                    margin: '-1px 0 0 -1px',
                    width: '140px'
                }}
            />
        </div>
    );
}

class Card extends Component {
    render() {
        const { name } = this.props;

        const card = setData[sanitizeCardName(name)];
        const filename = card.id;

        const images = {
            creature: BottomCroppedCard(filename),
            artifact: BottomCroppedCard(filename),
            action: BottomCroppedCard(filename),
            upgrade: BottomCroppedCard(filename)
        };

        const image = images[card.type] || FullCard(filename);

        return (
            <div
                style={{
                    display: 'flex'
                }}
            >
                {image}
            </div>
        );
    }
}

export default Card;
