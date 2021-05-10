import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Screen from './Screen';

const Component = () => (
    <div>
        <Screen isMobile={useMediaQuery({ maxWidth: 767 })} />
    </div>
);

export default Component;
