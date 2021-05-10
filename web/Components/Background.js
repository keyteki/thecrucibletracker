import React from 'react';
import _ from 'lodash';

const Background = ({ style }) => (
    <div
        style={{
            backgroundColor: 'white',
            position: 'fixed',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: -1 || _.get(style, 'zIndex'),
            ...style
        }}
    />
);

export default Background;
