import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../shared/Icon';
import { IM_LIBRARY2, IM_TARGET } from '../shared/iconConstants';

const spanish = {
  in_city: 'Est\xE1 dentro de los l\xEDmites de la ciudad',
  out_of_city: 'Est\xE1 fuera de los l\xEDmites de la ciudad',
};

const english = {
  in_city: 'It\'s in the city',
  out_of_city: 'It\'s outside of the city',
};

const translate = (value, language) => {
  switch (language) {
    case 'Spanish':
      return spanish[value];
    default:
      return english[value];
  }
};

const InCityMessage = props => (
  <div className={`city-indicator${(props.inTheCity ? ' in-city' : ' out-of-city')}`}>
    <div className="inner">
      {props.icon &&
        <Icon path={props.inTheCity ? IM_LIBRARY2 : IM_TARGET} size={33} />
      }
      <span>{translate(props.inTheCity ? 'in_city' : 'out_of_city', props.lang)}</span>
    </div>
  </div>
);

InCityMessage.propTypes = {
  inTheCity: PropTypes.bool,
  icon: PropTypes.bool,
  lang: PropTypes.string,
};

InCityMessage.defaultProps = {
  inTheCity: true,
  icon: true,
  lang: 'English',
};

export default InCityMessage;
