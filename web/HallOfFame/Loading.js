import React from 'react';
import Skeleton from 'react-skeleton-loader';

function Loading() {
    return (
        <div>
            <div
                style={{
                    margin: '10px 0 10px 20px',
                    fontSize: '34px'
                }}
            >
                Hall of Fame
            </div>
            <div
                style={{
                    marginTop: '20px',
                    marginLeft: '20px'
                }}
            >
                <Skeleton animated={false} borderRadius={0} width='90%' height='30px' count={10} />
            </div>
        </div>
    );
}

export default Loading;
