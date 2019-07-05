import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './topicCard.css';
import Icon from './Icon';
import {
  IM_SHIELD3,
  IM_COIN_DOLLAR,
  IM_OFFICE,
  IM_CITY,
  IM_BED,
  IM_LIBRARY2,
} from './iconConstants';
import { withLanguage } from '../utilities/lang/LanguageContext';

const getTopicIcon = (topic) => {
  switch (topic) {
    case 'CRIME':
      return (<Icon path={IM_SHIELD3} size={75} />)
    case 'DEVELOPMENT':
      return (<Icon path={IM_OFFICE} size={75} />)
    case 'BUDGET':
      return (<Icon path={IM_COIN_DOLLAR} size={75} />)
    case 'HOMELESSNESS':
      return (<Icon path={IM_BED} size={75} />)
    case 'CAPITAL_PROJECTS':
      return (<Icon path={IM_CITY} size={75} />)
    default:
      return (<Icon path={IM_LIBRARY2} size={75} />)
  }
};

const spanish = {
  CRIME: 'CRIMEN',
  DEVELOPMENT: 'URBANIZACI\xD3N',
  BUDGET: 'PRESUPUESTO',
  HOMELESSNESS: 'FALTA DE VIVIENDA',
  CAPITAL_PROJECTS: 'PROYECTOS_CAPITALES',
};

const english = {
  CRIME: 'CRIME',
  DEVELOPMENT: 'DEVELOPMENT',
  BUDGET: 'BUDGET',
  HOMELESSNESS: 'HOMELESSNESS',
  CAPITAL_PROJECTS: 'CAPITAL_PROJECTS',
};

const translateTopic = (topic, language) => {
  switch (language) {
    case 'Spanish':
      return spanish[topic];
    case 'English':
      return english[topic];
    default:
      return topic;
  }
};

const TopicCard = props => {
  const query = {};
  const queryPossiblies = ['view', 'entity', 'id', 'label', 'entities', 'x', 'y', 'search'];
  queryPossiblies.forEach(possibility => {
    if (props[possibility]) {
      query[possibility] = props[possibility];
    }
  })

  return (<Link
    className="topic-card"
    to={{
      pathname: props.path || props.topic,
      query,
    }}
  >
    <div className={styles.topicCard}>
      <div className="text-primary text-center">{getTopicIcon(props.topic)}</div>
      <div className="text-primary text-center">
        {translateTopic(props.topic, props.language.language).replace(/_/g, ' ')}
      </div>
    </div>
  </Link>
)};

TopicCard.propTypes = {
  topic: PropTypes.string,
  entity: PropTypes.string,
  search: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  entities: PropTypes.string,
  x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TopicCard.defaultProps = {
  view: 'map',
  // topic: 'CRIME',
  // entity: 'city',
  // search: null,
  // id: null,
  // label: null,
  // entities: 'address,property,neighborhood,street,owner',
  // x: null,
  // y: null,
};

export default withLanguage(TopicCard);
