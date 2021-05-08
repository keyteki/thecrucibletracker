import React from 'react';
import styled from 'styled-components';
import {
  Tooltip
} from '@material-ui/core';
import Link from './Link';

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  padding: 0 10px 10px 10px;
`;

const TitleContainer = styled.div`
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.25);
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #eee;
  position: relative;
`;

const Title = styled.div`
  flex-grow: 0;
  font-size: 20px;
  z-index: 3;
  background-color: #FAFAFA;
  padding: 2px 5px;
  margin-right: 5px;
  position: absolute;
  top: 5px;
  left: 85px;
`;

const Icon = styled.div`
  user-select: none;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 5px 0px;
  margin-right: 10px;
  z-index: 3;
`;

const FillContainer = styled.div`
  margin-left: 80px;
  height: 100%;
  width: calc(100% - 80px);
  position: absolute;
`;

const Fill = styled.div`
  width: ${(props) => {
    if (props.percentage > 1) {
      return `calc(${Math.min(props.percentage, 100)}%)`;
    }
    return 0;
  }};
  height: 100%;
  background: rgba(75,63,245,0.8);
  z-index: 1;
`;

const Percent = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const GameLink = styled.a`
  text-decoration: none;
  font-size: 12px;
`;

const GameLinkContainer = styled.div`
  margin-top: 40px;
  margin-left: 0px;
  background-color: #FAFAFA;
  padding: 2px 4px;
  z-index: 2;
`;

const Achievement = ({
  title,
  progress,
  percentage,
  showPercentage = true,
  showCount = true,
  globalCompletion,
  iconURL,
  iconMargin,
  iconWidth,
  iconScale,
  iconStyle,
  linkToGame,
  date,
  isMobile = false,
}) => (
  <Container>
    <TitleContainer>
      <Icon>
        <img
          style={({
            margin: iconMargin || '-45px 0 0 -100px',
            width: iconWidth || '250px',
            transformOrigin: 'top left',
            transform: iconScale ? `scale(${iconScale})` : null,
            ...iconStyle || {}
          })}
          src={iconURL}
        />
      </Icon>
      <FillContainer>
        <Fill percentage={percentage} />
        { showPercentage
          ? (
            <Percent>
              {`${percentage}%`}
            </Percent>
          ) : <div style={{ width: '12%' }} />}
      </FillContainer>
      <Title>{title}</Title>
      {!isMobile && showCount && progress != null && Math.min(percentage, 100) < 100
        && (
        <GameLinkContainer style={{
          color: '#FFF',
          fontSize: '11px',
          background: 'none',
          padding: '0',
        }}
        >
          {progress}
        </GameLinkContainer>
        )}
      {!isMobile && linkToGame
        && (
        <GameLinkContainer style={{
          background: 'none',
          padding: '0',
        }}
        >
          <GameLink style={{ color: '#FFF', fontSize: '11px' }} href={`/games/${linkToGame}`}>
            VIEW GAME
          </GameLink>
        </GameLinkContainer>
        )}
      {!isMobile && globalCompletion && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '10px',
          zIndex: '5',
          color: '#FFF',
          fontSize: '16px',
          background: 'none',
          padding: '0',
        }}
        >
          <Tooltip title="Global completion percentage" arrow placement="top">
            <div>{`${globalCompletion}%`}</div>
          </Tooltip>
        </div>
      )}
    </TitleContainer>
  </Container>
);

export default Achievement;
