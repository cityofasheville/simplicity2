import React from 'react';
import PropTypes from 'prop-types';

const ButtonGroup = props => (
  <div className={['btn-group pull-', props.alignment].join('')} style={props.style}>
    { props.children }
  </div>
);

ButtonGroup.propTypes = {
  children: PropTypes.node,
  alignment: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
};

ButtonGroup.defaultProps = {
  alignment: 'right',
};

export default ButtonGroup;
