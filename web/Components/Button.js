import React from 'react';
import styled from 'styled-components';

const PrimaryButton = styled.div`
    color: #0000ee;
    text-decoration: none;
    cursor: pointer;
    width: fit-content;
    height: fit-content;

    &:hover {
        text-decoration: underline;
    }
`;

const SecondaryButton = styled.div`
    color: #767676;
    text-decoration: none;
    cursor: pointer;
    width: fit-content;
    height: fit-content;

    &:hover {
        color: #0000ee;
    }
`;

class Component extends React.Component {
    render() {
        const { text, onClick, type } = this.props;

        if (type === 'secondary') {
            return <SecondaryButton onClick={onClick}>{text}</SecondaryButton>;
        }

        return <PrimaryButton onClick={onClick}>{text}</PrimaryButton>;
    }
}

export default Component;
