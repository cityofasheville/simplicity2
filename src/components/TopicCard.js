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

// TODO: add the link parameters
const TopicCard = props => (
  <Link to={[['/topics', props.topic].join('/'), props.urlParams].join('?')}>
    <div className={styles.topicCard}>
      <i className={[['fa fa-', getTopicIcon(props.topic)].join(''), 'fa-5x text-primary text-center'].join(' ')}></i>
      <div className="text-primary text-center">{props.topic}</div>
    </div>
  </Link>
);

TopicCard.propTypes = {
  topic: React.PropTypes.string,
  urlParams: React.PropTypes.string,
};

TopicCard.defaultProps = {
  topic: 'CRIME',
  urlParams: 'searchby=citywide&view=summary',
};

export default TopicCard;
