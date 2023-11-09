import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from './Icon';
import {
  IM_SHIELD3,
  IM_COIN_DOLLAR,
  IM_OFFICE,
  IM_CITY,
  IM_BED,
  IM_LIBRARY2,
  IM_ENVELOP3,
  IM_TREE,
} from './iconConstants';
import { withLanguage } from '../utilities/lang/LanguageContext';

const getTopicIcon = (topic) => {
  switch (topic) {
    case 'CRIME':
      return (<Icon path={IM_SHIELD3} size={75} />)
    case 'DEVELOPMENT_WEBSITE':
      return (<Icon path={IM_CITY} size={75} />)
    case 'DEVELOPMENT_DASHBOARD':
      return (<Icon path={IM_OFFICE} size={75} />)
    case 'DEVELOPMENT_NOTIFICATION':
      return (<Icon path={IM_ENVELOP3} size={75} />)
    case 'BUDGET':
      return (<Icon path={IM_COIN_DOLLAR} size={75} />)
    case 'HOMELESSNESS':
      return (<Icon path={IM_BED} size={75} />)
    case 'CAPITAL_PROJECTS':
      return (<Icon path={IM_CITY} size={75} />)
    case 'CLIMATE':
      return (<Icon path={IM_TREE} size={75} />)
    default:
      return (<Icon path={IM_LIBRARY2} size={75} />)
  }
};

const spanish = {
  CRIME: ['', 'CRIMEN'],
  DEVELOPMENT_WEBSITE: ['DEVELOPMENT_DEPARTMENT_WEBSITE', 'Learn more or apply for a permit'],
  DEVELOPMENT_DASHBOARD: ['DEVELOPMENT_DASHBOARD', 'View Building Permits and get Email Notifications'],
  DEVELOPMENT_NOTIFICATION: ['DEVELOPMENT_NOTIFICATION', 'Recieve Emails about Development Permits'],
  DEVELOPMENT: ['', 'URBANIZACI\xD3N'],
  BUDGET: ['', 'PRESUPUESTO'],
  HOMELESSNESS: ['', 'FALTA DE VIVIENDA'],
  CAPITAL_PROJECTS: ['', 'PROYECTOS_CAPITALES'],
  CLIMATE: ['', 'Climate Threats and Vulnerability'],
};

const english = {
  CRIME: ['', 'CRIME'],
  DEVELOPMENT_WEBSITE: ['DEVELOPMENT_DEPARTMENT_WEBSITE', 'Learn more or apply for a permit'],
  DEVELOPMENT_DASHBOARD: ['DEVELOPMENT_DASHBOARD', 'View Building Permits and get Email Notifications'],
  DEVELOPMENT_NOTIFICATION: ['DEVELOPMENT_NOTIFICATION', 'Recieve Emails about Development Permits'],
  DEVELOPMENT: ['', 'DEVELOPMENT'],
  BUDGET: ['', 'BUDGET'],
  HOMELESSNESS: ['', 'HOMELESSNESS'],
  CAPITAL_PROJECTS: ['CAPITAL_PROJECTS', 'Major City Expendatures'],
  CLIMATE: ['CLIMATE', 'Climate Threats and Vulnerability'],
};

const translateTopic = (topic, language) => {
  switch (language) {
    case 'Spanish':
      return spanish[topic];
    case 'English':
      return english[topic];
    default:
      return english[topic];
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

  let target = '_self';
  if (props.path && props.path.substring(0, 4) === 'http') {
    target = '_blank';
  }
  const topics = translateTopic(props.topic, props.language.language);
  return (<Link
    className="topic-card"
    to={{
      pathname: props.path || props.topic,
      query,
    }}
    target={target}
  >

    <div className="topicCard">
      <div className="text-primary text-center">
        {topics[0].replace(/_/g, ' ')}
      </div>
      <div className="text-primary text-center">{getTopicIcon(props.topic)}</div>
      <div className="text-primary text-center">
        {topics[1].replace(/_/g, ' ')}
      </div>
    </div>
  </Link>
  )
};

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
