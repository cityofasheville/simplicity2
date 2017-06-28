import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaBed from 'react-icons/lib/fa/bed';
import FaBank from 'react-icons/lib/fa/bank';
import MdNowWidgets from 'react-icons/lib/md/now-widgets';
import MdLocationCity from 'react-icons/lib/md/location-city';
import TiChartBarOutline from 'react-icons/lib/ti/chart-bar-outline';
import styles from './topicCard.css';
import Icon from './Icon';
import { ICONPATHS } from './iconConstants';

const getTopicIcon = (topic) => {
  switch (topic) {
    case 'CRIME':
      return (<Icon icon={ICONPATHS.SHIELD} size={75} />)
      //return (<FaShield size={75} />);
    case 'DEVELOPMENT':
      return (<Icon icon={ICONPATHS.OFFICE} size={75} />)
    case 'BUDGET':
      return (<Icon icon={ICONPATHS.COIN_DOLLAR} size={75} />)
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
