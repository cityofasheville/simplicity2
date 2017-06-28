import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FaShield from 'react-icons/lib/fa/shield';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaDollar from 'react-icons/lib/fa/dollar';
import FaBed from 'react-icons/lib/fa/bed';
import FaBank from 'react-icons/lib/fa/bank';
import MdNowWidgets from 'react-icons/lib/md/now-widgets';
import MdLocationCity from 'react-icons/lib/md/location-city';
import TiChartBarOutline from 'react-icons/lib/ti/chart-bar-outline';
import styles from './topicCard.css';

const getTopicIcon = (topic) => {
  switch (topic) {
    case 'CRIME':
      return (<FaShield size={75} />);
    case 'DEVELOPMENT':
      return (<FaBuildingO size={75} />);
    case 'BUDGET':
      return (<FaDollar size={75} />);
    case 'HOMELESSNESS':
      return (<FaBed size={75} />);
    case 'CAPITAL_PROJECTS':
      return (<MdLocationCity size={75} />);
    default:
      return (<FaBank size={75} />);
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
