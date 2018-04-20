import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './topicCard.css';
import Icon from './Icon';
import { IM_SHIELD3, IM_COIN_DOLLAR, IM_USERS, IM_USERS4, IM_OFFICE, IM_CITY, IM_PROFILE, LI_WALKING, IM_BED, IM_LIBRARY2, IM_WARNING } from './iconConstants';

const getTopicIcon = (topic) => {
  switch (topic) {
    case 'CRIME':
      return (<Icon path={IM_SHIELD3} size={75} />)
    case 'DEVELOPMENT':
      return (<Icon path={IM_OFFICE} size={75} />)
    case 'BUDGET':
      return (<Icon path={IM_COIN_DOLLAR} size={75} />)
    case 'HOMELESSNESS':
      return (<Icon path={IM_USERS4} size={75} />)      
    case 'CAPITAL_PROJECTS':
      return (<Icon path={IM_CITY} size={75} />)
    default:
      return (<Icon path={IM_LIBRARY2} size={75} />)
  }
};

const TopicCard = props => (
  <Link className="topic-card" to={{ pathname: props.topic, query: { entity: props.entity, view: 'map', id: props.id, label: props.label, entities: props.entities, x: props.x, y: props.y, search: props.search } }}>
    <div className={styles.topicCard}>
      <div className="text-primary text-center">{getTopicIcon(props.topic)}</div>
      <div className="text-primary text-center">{props.topic.replace(/_/g, ' ')}</div>
    </div>
  </Link>
);

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
  topic: 'CRIME',
  entity: 'city',
  search: '',
  id: '',
  label: '',
  entities: 'address,property,neighborhood,street,google,owner',
  x: '',
  y: '',
};

export default TopicCard;
