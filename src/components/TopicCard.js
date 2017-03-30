import React from 'react';
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
    default:
      return 'university';
  }
};

const TopicCard = props => (
  <Link to={{ pathname: ['/topics', props.topic].join('/'), query: { entity: props.entity, view: 'summary', id: props.id, label: props.label } }}>
    <div className={styles.topicCard}>
      <i className={[['fa fa-', getTopicIcon(props.topic)].join(''), 'fa-5x text-primary text-center'].join(' ')}></i>
      <div className="text-primary text-center">{props.topic}</div>
    </div>
  </Link>
);

TopicCard.propTypes = {
  topic: React.PropTypes.string,
  entity: React.PropTypes.string,
  id: React.PropTypes.string,
  label: React.PropTypes.string,
};

TopicCard.defaultProps = {
  topic: 'CRIME',
  entity: 'city',
  id: '',
  label: '',
};

export default TopicCard;
