import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../shared/Icon';
import { IM_LIBRARY2, IM_TARGET } from '../shared/iconConstants';
import styles from './inCityMessage.css';

const InCityMessage = props => (
  <span className={styles.inCityMessage}>
    {props.inTheCity &&
      <span className={styles.inCity}>
        {props.icon && <Icon path={IM_LIBRARY2} size={33} />}
        <span>{props.text(props.inTheCity)}</span>
      </span>
    }
    {!props.inTheCity &&
      <span className={styles.notInCity}>
        {props.icon && <Icon path={IM_TARGET} size={33} />}
        <span>{props.text(props.inTheCity)}</span>
      </span>
    }
  </span>
);

InCityMessage.propTypes = {
  inTheCity: PropTypes.bool,
  text: PropTypes.func,
  icon: PropTypes.bool,
};

InCityMessage.defaultProps = {
  inTheCity: true,
  text: (inOutBool) => inOutBool ? "It's in the city" : "It's outside of the city",
  icon: true,
};

export default InCityMessage;
