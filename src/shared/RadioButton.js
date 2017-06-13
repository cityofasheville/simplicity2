import React from 'react';
import PropTypes from 'prop-types';

const RadioButton = props => (
  <div className={props.inline ? 'radio radio-inline' : 'radio'} onClick={props.onClick}>
    <label htmlFor={props.name}>
      <input type="radio" checked={props.checked} name={props.name} value={props.value} readOnly />
      {props.display || props.name}
    </label>
  </div>
);

RadioButton.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool,
  inline: PropTypes.bool,
  onClick: PropTypes.func,
  display: PropTypes.string,
};

RadioButton.defaultProps = {
  inline: false,
  onClick: null,
};

export default RadioButton;

