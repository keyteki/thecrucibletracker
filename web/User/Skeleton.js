import React, { Component, } from 'react';
import Skeleton from 'react-skeleton-loader';

class Skeletons extends Component {
  render() {
    return (
      <div>
        {(new Array(1)).fill(0).map((n, i) => (
          <div key={`skel${i}`} style={{ marginBottom: '30px', }}>
            <div style={{ marginBottom: '10px', }}>
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
            </div>
            <div style={{ marginBottom: '10px', }}>
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
            </div>
            <div style={{ marginBottom: '10px', }}>
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
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Skeletons;
