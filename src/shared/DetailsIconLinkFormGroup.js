import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './detailsIconLinkFormGroup.css';

const DetailsIconLinkFormGroup = props => (
  <div>
    <a href={props.href} title={props.title}>
      <div className={['form-group', styles.detailsIconLinkFormGroup].join(' ')}>
        <i className={['fa fa-', props.icon].join('')}></i>
        <div className={styles.labelClass}>{props.label}</div>
      </div>
    </a>
  </div>
);

DetailsIconLinkFormGroup.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.string,
};

DetailsIconLinkFormGroup.defaultProps = {
  label: '',
  icon: '',
  href: 'www.ashevillenc.gov',
  title: 'City of Asheville Website',
};

export default DetailsIconLinkFormGroup;
