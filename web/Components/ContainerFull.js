import React from 'react';

const Container = ({
  children, width, padding, marginTop, background
}) => (
  <div style={{
    marginTop: marginTop || '80px',
    width: '100%',
  }}
  >
    <div style={{
      position: 'fixed',
      top: '0px',
      bottom: '0',
      left: '0',
      right: '0',
      background: background || '#FFF',
      zIndex: -1,
    }}
    />
    <div style={{
      margin: '0px auto 100px auto',
      width: width || '780px',
      padding: padding || '0 10px',
    }}
    >
      {children}
    </div>
  </div>
);

export default Container;
