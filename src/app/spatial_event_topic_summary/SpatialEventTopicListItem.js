import React from 'react';
import PropTypes from 'prop-types';
import CrimeListItem from '../crime/CrimeListItem';
import DevelopmentListItem from '../development/DevelopmentListItem';
import styles from './spatialEventTopicListItemStyles.css';

const SpatialEventTopicListItem = props => (
  <div className={['row', styles.topicSummaryListItem].join(' ')}>
    {props.spatialEventTopic === 'crime' ? <CrimeListItem itemData={props.itemData} />
      : <DevelopmentListItem itemData={props.itemData} />}
  </div>
);

SpatialEventTopicListItem.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  itemData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default SpatialEventTopicListItem;
