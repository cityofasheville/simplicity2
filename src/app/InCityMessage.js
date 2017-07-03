import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../shared/Icon';
import { IM_LIBRARY2, IM_TARGET } from '../shared/iconConstants';
import styles from './inCityMessage.css';

const InCityMessage = props => (
  <span className={styles.inCityMessage}>
    {props.inTheCity &&
      <span className={styles.inCity}>
        <Icon path={IM_LIBRARY2} size={33} />
        <span> It&apos;s in the city</span>
      </span>
    }
    {!props.inTheCity &&
      <span className={styles.notInCity}>
        <Icon path={IM_TARGET} size={33} />
        <span>It&apos;s outside of the city</span>
      </span>
    }
  </span>
);

InCityMessage.propTypes = {
  inTheCity: PropTypes.bool,
};

InCityMessage.defaultProps = {
  inTheCity: true,
};

export default InCityMessage;
