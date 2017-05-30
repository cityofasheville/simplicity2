import React from 'react';
import PropTypes from 'prop-types';
import styles from './detailsFormGroup.css';

const DetailsFormGroup = props => (
  <div className={['form-group', styles.detailsFormGroup].join(' ')}>
    {props.hasIcon && <i className={['fa fa-', props.icon].join('')}></i>}
    {props.hasLabel &&
      <div className={styles.labelClass}>{props.label}</div>
    }
    <div className={styles.valueClass}>{props.value}</div>
  </div>
);

DetailsFormGroup.propTypes = {
  hasIcon: PropTypes.bool,
  hasLabel: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.string,
};

DetailsFormGroup.defaultProps = {
  hasIcon: false,
  hasLabel: false,
  label: '',
  value: '',
  icon: '',
};

export default DetailsFormGroup;
