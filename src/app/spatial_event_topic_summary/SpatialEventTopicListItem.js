import React from 'react';
import CrimeListItem from '../crime/CrimeListItem';
import DevelopmentListItem from '../development/DevelopmentListItem';
import styles from './spatialEventTopicListItemStyles.css';

const SpatialEventTopicListItem = props => (
  <div className={['row', styles.topicSummaryListItem].join(' ')}>
    {props.spatialEventTopic === 'Crime' ? <CrimeListItem itemData={props.itemData} />
      : <DevelopmentListItem itemData={props.itemData} />}
  </div>
);

SpatialEventTopicListItem.propTypes = {
  spatialEventTopic: React.PropTypes.string.isRequired,
  itemData: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default SpatialEventTopicListItem;
