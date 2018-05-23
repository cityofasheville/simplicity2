import React from 'react';
import PropTypes from 'prop-types';

// https://medium.com/@david.gilbertson/icons-as-react-components-de3e33cb8792

const Icon = (props) => {
  const styles = {
    svg: {
      display: 'inline-block',
      verticalAlign: props.verticalAlign,
    },
    path: {
      fill: props.color || 'currentColor',
    },
  };

  return (
    <svg
      style={styles.svg}
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox={props.viewBox ? props.viewBox : '0 0 16 16'}
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        {props.path
          .split(',')
          .map((path, index) => (
            <path key={['path', index].join('_')} style={styles.path} d={path} />
          ))}
      </g>
    </svg>
  );
};

Icon.propTypes = {
  path: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  viewBox: PropTypes.string,
  verticalAlign: PropTypes.string,
};

Icon.defaultProps = {
  size: 16,
  verticalAlign: 'middle',
};

export default Icon;
