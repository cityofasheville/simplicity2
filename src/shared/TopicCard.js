import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './topicCard.css';

const getTopicIcon = (topic) => {
  switch (topic) {
    case 'CRIME':
      return 'shield';
    case 'DEVELOPMENT':
      return 'building-o';
    case 'BUDGET':
      return 'usd';
    case 'HOMELESSNESS':
      return 'hotel';
    default:
      return 'university';
  }
};

const TopicCard = props => (
  <Link to={{ pathname: props.topic, query: { entity: props.entity, view: 'summary', id: props.id, label: props.label } }}>
    <div className={styles.topicCard}>
      <i className={[['fa fa-', getTopicIcon(props.topic)].join(''), 'fa-5x text-primary text-center'].join(' ')}></i>
      <div className="text-primary text-center">{props.topic}</div>
    </div>
  </Link>
);

TopicCard.propTypes = {
  topic: PropTypes.string,
  entity: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};

TopicCard.defaultProps = {
  topic: 'CRIME',
  entity: 'city',
  id: '',
  label: '',
};

export default TopicCard;
