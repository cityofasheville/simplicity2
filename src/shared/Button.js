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

const getButtonStyle = (positionInGroup) => {
  switch (positionInGroup) {
    case 'left':
      return { borderTopRightRadius: '0px', borderBottomRightRadius: '0px' };
    case 'right':
      return { borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' };
    case 'middle':
      return { borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' };
    default:
      return null;
  }
};

const Button = props => (
  <button className={getButtonClass(props.size, props.type, props.active)} style={getButtonStyle(props.positionInGroup)} onClick={props.onClick} >
    {props.children}
  </button>
);

Button.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
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
};

export default Button;
