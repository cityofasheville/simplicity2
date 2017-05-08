import React from 'react';

const LoadingAnimation = (props) => {
  switch (props.size) {
    case 'small':
      return (
        <div style={{ marginTop: props.marginTop, textAlign: 'center' }}>
          <div style={{ marginTop: '30px' }} className="cssload-loader-small">
            <div className="cssload-dot-small"></div>
            <div className="cssload-dot-small"></div>
            <div className="cssload-dot-small"></div>
            <div className="cssload-dot-small"></div>
            <div className="cssload-dot-small"></div>
          </div>
          <div style={{ paddingTop: '250px' }}>{props.message}</div>
        </div>
      );
    default:
      return (
        <div style={{ marginTop: props.marginTop, textAlign: 'center' }}>
          <div style={{ marginTop: '30px' }} className="cssload-loader">
            <div className="cssload-dot"></div>
            <div className="cssload-dot"></div>
            <div className="cssload-dot"></div>
            <div className="cssload-dot"></div>
            <div className="cssload-dot"></div>
          </div>
          <div style={{ paddingTop: '250px' }}>{props.message}</div>
        </div>
      );
  }
};

LoadingAnimation.propTypes = {
  size: React.PropTypes.string,
  message: React.PropTypes.string,
  marginTop: React.PropTypes.string,
};

LoadingAnimation.defaultProps = {
  name: 'large',
  message: 'Loading...',
  marginTop: '15px;',
};

export default LoadingAnimation;
