import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './topicCard.css';
import Icon from './Icon';
import { IM_SHIELD3, IM_COIN_DOLLAR, IM_OFFICE, IM_BED, IM_LIBRARY2 } from './iconConstants';

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
      return (<svg xmlns="http://www.w3.org/2000/svg" width="69" height="69">
        <path d="M45,57a2,2 0 0,1-3,1l-2-3V39l-6,10-11-6l9-18h-6l-8 14l-3-3V33l8-14h20a4,4 0 0,1 4,4zm16,12l-41-34l1-3 42,35 8-10a5,5 0 0,1 9,0l22,29h-57l13-16zm-28-18l7,10 1,25a8,8 0 0,1-6-4l-1-17-8-11-18,31a4,4 0 0,1-2-2l-1-6 17-32zm13-36a7,7 0 0,1 14,0a7,7 0 0,1-14,0" fill="#4077a5" />
      </svg>)
    default:
      return (<Icon path={IM_LIBRARY2} size={75} />)
  }
};

const TopicCard = props => (
  <Link to={{ pathname: props.topic, query: { entity: props.entity, view: 'summary', id: props.id, label: props.label } }}>
    <div className={styles.topicCard}>
      <div className="text-primary text-center">{getTopicIcon(props.topic)}</div>
      <div className="text-primary text-center">{props.topic.replace(/_/g, ' ')}</div>
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
