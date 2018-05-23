import React from 'react';
import PropTypes from 'prop-types';

const getButtonClass = (size, type, active) => {
  const typeStr = [' btn', type].join('-');
  switch (size) {
    case 'sm':
      return ['btn', ' btn-sm', typeStr, active ? ' active' : ''].join('');
    case 'xs':
      return ['btn', ' btn-xs', typeStr, active ? ' active' : ''].join('');
    default:
      return ['btn', typeStr, active ? ' active' : ''].join('');
  }
};

const getButtonStyle = (positionInGroup, extraStyle) => {
  switch (positionInGroup) {
    case 'left':
      return { borderTopRightRadius: '0px', borderBottomRightRadius: '0px', ...extraStyle };
    case 'right':
      return { borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', ...extraStyle };
    case 'middle':
      return {
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px',
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        ...extraStyle,
      };
    default:
      return extraStyle;
  }
};

const Button = props => (
  <button
    className={getButtonClass(props.size, props.type, props.active)}
    style={getButtonStyle(props.positionInGroup, props.style)}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

Button.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  positionInGroup: PropTypes.string,
};

Button.defaultProps = {
  size: 'regular',
  type: 'primary',
  active: false,
  positionInGroup: null, // left, middle, right
  onClick: null,
  style: {},
  children: undefined,
};

export default Button;
