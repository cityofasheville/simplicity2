import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../shared/Icon';
import { IM_LIBRARY2, IM_TARGET } from '../shared/iconConstants';
import styles from './inCityMessage.css';

const InCityMessage = props => (
  <div className={"city-indicator" + (props.inTheCity ? " in-city" : " out-of-city")}>
    {props.inTheCity &&
      <div className="inner">
        {props.icon && <Icon path={IM_LIBRARY2} size={33} />}
        <span>{props.text(props.inTheCity)}</span>
      </div>
    }
    {!props.inTheCity &&
      <div className="inner">
        {props.icon && <Icon path={IM_TARGET} size={33} />}
        <span>{props.text(props.inTheCity)}</span>
      </div>
    }
  </div>
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
