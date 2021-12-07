import React from 'react';
import PropTypes from 'prop-types';

const DetailsFormGroup = props => (
  <div className={props.icon ? 'form-group form-group--has-content form-group--has-icon' : 'form-group form-group--has-content'}>
    <div className="form-group__inner">
      <div className={props.name == "pinnum" ? 'form-group__label steep-slope-tag' : 'form-group__label'}>
      {props.icon !== null &&
      <span>{props.icon}</span>
      }
      {props.hasLabel &&
        <label htmlFor={props.name}>{props.label}</label>
      }
      { props.name == "pinnum" && 
      <div className="steep-slope-btn">Get Steep Slope Data</div>
      }
      </div>
      <div className="form-group__value" name={props.name}>{props.value}</div>
    </div>
  </div>
);

DetailsFormGroup.propTypes = {
  hasLabel: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  name: PropTypes.string,
  // colWidth: PropTypes.string,
};

DetailsFormGroup.defaultProps = {
  hasIcon: false,
  hasLabel: false,
  label: '',
  value: '',
  icon: null,
  name: '',
  // colWidth: '12',
};

export default DetailsFormGroup;
