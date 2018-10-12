import React from 'react';

const LoadingModal = (props) => (
  <div
    // TODO: FIGURE OUT HOW TO MAKE THIS APPEAR ON LOAD
    id="loading-modal"
    style={{
      height: '100%',
      width: '100%',
      opacity: 0.1,
      zIndex: 1,
      position: 'absolute',
      cursor: 'progress',
      display: props.open ? 'unset' : 'none',
    }}
  ></div>
)

// TODO: ADD PROPS
// OPEN

export default LoadingModal;
