import React from 'react';

const Container = ({ children, background }) => (
    <div style={{ marginTop: '100px', width: '100%' }}>
        <div
            style={{
                position: 'relative',
                background: background || '#FFF',
                borderDadius: '2px',
                boxShadow: 'rgba(0, 0, 0, 0.2) 2px 2px 5px 0px',
                padding: '10px 0',
                margin: '100px auto 20px'
            }}
        >
            {children}
        </div>
    </div>
);

export default Container;
