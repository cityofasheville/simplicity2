import React from 'react';
import PropTypes from 'prop-types';
import FaBank from 'react-icons/lib/fa/bank';
import FaBullseye from 'react-icons/lib/fa/bullseye';
import styles from './inCityMessage.css';

const InCityMessage = props => (
  <span className={styles.inCityMessage}>
    {props.inTheCity &&
      <span className={styles.inCity}>
        <FaBank size={33} />
        <span> It&apos;s in the city</span>
      </span>
    }
    {!props.inTheCity &&
      <span className={styles.notInCity}>
        <FaBullseye size={33} />
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
