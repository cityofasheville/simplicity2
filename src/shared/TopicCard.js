import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from './Icon';
import { TopicCardAccessible } from './TopicCardAccessible';
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
      return (<Icon path={IM_SHIELD3} size={40} />)
    case 'DEVELOPMENT_WEBSITE':
      return (<Icon path={IM_CITY} size={40} />)
    case 'DEVELOPMENT_DASHBOARD':
      return (<Icon path={IM_OFFICE} size={40} />)
    case 'DEVELOPMENT_NOTIFICATION':
      return (<Icon path={IM_ENVELOP3} size={40} />)
    case 'BUDGET':
      return (<Icon path={IM_COIN_DOLLAR} size={40} />)
    case 'HOMELESSNESS':
      return (<Icon path={IM_BED} size={40} />)
    case 'CAPITAL_PROJECTS':
      return (<Icon path={IM_CITY} size={40} />)
    case 'CLIMATE':
      return (<Icon path={IM_TREE} size={40} />)
    default:
      return (<Icon path={IM_LIBRARY2} size={40} />)
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
  DEVELOPMENT_NOTIFICATION: ['GET NOTIFICATIONS', 'Recieve Emails about Development Permits'],
  DEVELOPMENT: ['', 'DEVELOPMENT'],
  BUDGET: ['', 'BUDGET'],
  HOMELESSNESS: ['', 'HOMELESSNESS'],
  CAPITAL_PROJECTS: ['CAPITAL_PROJECTS', 'Major City Expenditures'],
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
  React.useEffect(TopicCardAccessible, []);
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

  const styles = {
    card: {
      padding: '1rem',
    },
    cardLink: {
      margin: 0,
      padding: 0,
    },
    cardHeading: {
      marginBottom: '1rem',
      padding:0
    },
    cardIcon: {
      marginBottom: '1rem',
    },
    cardSubheading: {
      marginBottom: '1rem',
    }
  }

  return (

    <div className="topicCard" style={styles.card}>
      <Link
        className="topic-card"
        to={{
          pathname: props.path || props.topic,
          query,
        }}
        target={target}
        style={styles.cardLink}
      >
        <div className="h4 text-primary text-center" style={styles.cardHeading}>
          {topics[0].replace(/_/g, ' ')}
        </div>


      </Link>
      <div className="text-primary text-center" style={styles.cardIcon}>{getTopicIcon(props.topic)}</div>
      <div className="text-primary text-center" style={styles.cardSubheading}>
        {topics[1].replace(/_/g, ' ')}
      </div>

    </div>
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
