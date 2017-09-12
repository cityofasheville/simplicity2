import React from 'react';
import PropTypes from 'prop-types';

const DetailsFormGroup = props => (
  <div className="form-group">
    <div className="col-xs-12" style={{ marginBottom: '10px' }}>
      {props.icon !== null &&
      <span style={{ marginRight: '5px' }}>{props.icon}</span>
      }
      {props.hasLabel &&
        <label htmlFor={props.name}>{props.label}</label>
      }
      <div style={{ marginLeft: '15px' }} name={props.name}>{props.value}</div>
    </div>
  </div>
);

DetailsFormGroup.propTypes = {
  hasLabel: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  name: PropTypes.string,
};

DetailsFormGroup.defaultProps = {
  hasIcon: false,
  hasLabel: false,
  label: '',
  value: '',
  icon: null,
  name: '',
};

export default DetailsFormGroup;
