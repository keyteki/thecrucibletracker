import React from 'react';
import Skeleton from 'react-skeleton-loader';

export default function () {
    return (
        <div style={{ padding: '10px' }}>
            {new Array(3).fill(0).map((n, i) => (
                <div key={i} style={{ margin: '20px 15px' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                        <Skeleton
                            animated={false}
                            borderRadius={0}
                            width='100%'
                            height='30px'
                            widthRandomness={0}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
