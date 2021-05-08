import React, { Component } from 'react';
import Skeleton from 'react-skeleton-loader';
import styled from 'styled-components';
import _ from 'lodash';
import { Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Achievement from '../Components/Achievement';
import metadata from '../achievements/metadata';

class Achievements extends Component {
  constructor() {
    super();
    this.state = {
      achievements: [],
      loaded: false,
    };
  }

  componentDidMount(prevProps, prevState, snapshot) {
    if (!this.props.user) {
      return;
    }

    fetch(`/api/users/${this.props.user}/achievements`)
      .then((response) => response.json())
      .then(({ achievements }) => {
        this.setState({
          loaded: true,
          achievements,
        });
      });
  }

  render() {
    const {
      achievements,
      loaded,
    } = this.state;
    const {
      isMobile,
    } = this.props;

    if (!loaded) {
      return (
        <>
          <Skeleton
            animated={false}
            borderRadius={0}
            width="100%"
            height="30px"
            widthRandomness={0}
          />
          <Skeleton
            animated={false}
            borderRadius={0}
            width="100%"
            height="30px"
            widthRandomness={0}
          />
          <Skeleton
            animated={false}
            borderRadius={0}
            width="100%"
            height="30px"
            widthRandomness={0}
          />
        </>
      );
    }

    return (
      <div>
        <div style={{ margin: '10px' }}>
          <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center', }}>
            <div style={{ fontSize: '20px', userSelect: 'none', marginRight: '5px' }}>Achievements</div>
          </div>
        </div>
        { achievements.length > 0 && (
          achievements.filter((a) => metadata[a.name])
            .sort((a, b) => {
              if (a.date_awarded_on && !b.date_awarded_on) return -1;
              if (!a.date_awarded_on && b.date_awarded_on) return 1;
              return a.globalCompletion - b.globalCompletion;
              return metadata[a.name].title.localeCompare(metadata[b.name].title);
            })
            .map(({
              name,
              progress,
              date_awarded_on,
              game_awarded_in_crucible_game_id,
              globalCompletion
            }) => {
              const {
                iconMargin,
                iconWidth,
                iconScale,
                icon,
                goal,
                title,
                iconStyle,
              } = metadata[name];

              const showCount = !(name === 'play-50-games'
               || name === 'play-200-games'
               || name === 'play-500-games'
               || name === 'play-1000-games'
               || name === 'play-2000-games');

              return (
                <Achievement
                  title={title}
                  progress={progress !== 0 && date_awarded_on == null ? progress : null}
                  percentage={progress !== 0 ? (progress / goal * 100).toFixed(0) : date_awarded_on == null ? 0 : 100}
                  globalCompletion={globalCompletion < 1 ? globalCompletion.toFixed(1) : globalCompletion.toFixed(0)}
                  showCount={showCount}
                  isMobile={isMobile}
                  showPercentage={false}
                  iconURL={icon}
                  iconWidth={iconWidth}
                  iconScale={iconScale}
                  iconStyle={iconStyle}
                  iconMargin={iconMargin}
                  linkToGame={game_awarded_in_crucible_game_id}
                  key={name}
                />
              );
            })
        )}
      </div>
    );
  }
}
export default Achievements;
