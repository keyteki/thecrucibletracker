import React from 'react';
import styled from 'styled-components';

const PrimaryAnchor = styled.a`
  font-size: ${(props) => props.fontSize || 'unset'};
  font-weight: ${(props) => props.fontWeight || 'initial'};
  color: ${(props) => (props.color === 'default' ? '' : props.color || '#0000EE')};
  text-decoration: none;
  cursor: pointer;
  width:fit-content; 
  height:fit-content; 

  &:hover {
    text-decoration: underline;
  }
`;

const SecondaryAnchor = styled.a`
  font-size: ${(props) => props.fontSize || '12px'};
  font-weight: ${(props) => props.fontWeight || 'initial'};
  color: ${(props) => (props.color === 'default' ? '' : props.color || '#767676')};
  text-decoration: none;
  cursor: pointer;
  width:fit-content; 
  height:fit-content; 

  &:hover {
    color: #0000EE;
  }
`;

class Component extends React.Component {
  render() {
    const {
      text,
      url,
      type,
      fontSize,
      fontWeight,
      color,
      newTab,
    } = this.props;

    if (type === 'secondary') {
      return (
        <SecondaryAnchor href={url} fontSize={fontSize} fontWeight={fontWeight} color={color} {...this.props}>
          {text}
        </SecondaryAnchor>
      );
    }

    return (
      <PrimaryAnchor color={color} href={url} fontSize={fontSize} fontWeight={fontWeight} target={newTab ? '_blank' : undefined} {...this.props}>
        {text}
      </PrimaryAnchor>
    );
  }
}

export default Component;
