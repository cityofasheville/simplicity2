import React from 'react';
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
  hasIcon: React.PropTypes.bool,
  hasLabel: React.PropTypes.bool,
  label: React.PropTypes.string,
  value: React.PropTypes.string,
  icon: React.PropTypes.string,
};

DetailsFormGroup.defaultProps = {
  hasIcon: false,
  hasLabel: false,
  label: '',
  value: '',
  icon: '',
};

export default DetailsFormGroup;
