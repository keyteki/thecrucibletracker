import React from 'react';
import Link from './Link';

export default ({ top, isMobile }) => (
  <div
    style={{
      zIndex: '10',
      height: '50px',
      minWidth: isMobile ? '' : '1035px',
      position: 'absolute',
      left: '0',
      right: '0',
      top: top || '0',
      backgroundColor: 'white',
      boxShadow: 'rgba(0, 0, 0, 0.2) 2px 2px 5px 0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
    className="nav"
  >
    <a
      style={{
        cursor: 'pointer',
        marginLeft: '5px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        outline: 'none',
      }}
      href="/"
      tabIndex="-1"
    >
      <div className="logo-image" />
      <div style={{
        display: 'inline-block',
        fontSize: '24px',
        marginBottom: '2px',
        color: 'black',
        userSelect: 'none',
      }}
      >
        Crucible Tracker
      </div>
    </a>
  </div>
);
