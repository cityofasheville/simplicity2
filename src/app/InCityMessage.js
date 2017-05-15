import React from 'react';
import styles from './inCityMessage.css';

const InCityMessage = props => (
  <span className={styles.inCityMessage}>
    {props.inTheCity &&
      <span className={styles.inCity}>
        <i className="fa fa-university"></i>
        <span>It&apos;s in the city</span>
      </span>
    }
    {!props.inTheCity &&
      <span className={styles.notInCity}>
        <i className="fa fa-bullseye"></i>
        <span>It&apos;s outside of the city</span>
      </span>
    }
  </span>
);

InCityMessage.propTypes = {
  inTheCity: React.PropTypes.bool,
};

InCityMessage.defaultProps = {
  inTheCity: true,
};

export default InCityMessage;
