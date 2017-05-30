import React from 'react';
import PropTypes from 'prop-types';
import SpatialEventTopicListItem from './SpatialEventTopicListItem';
import styles from './spatialEventTopicListStyles.css';

const SpatialEventTopicList = props => (
  <div className="col-xs-12">
    <div className={styles.topicSummaryList}>
      {props.listData.map((itemData, i) => (
        <SpatialEventTopicListItem key={i} itemData={itemData} spatialEventTopic={props.spatialEventTopic} />
      ))}
    </div>
  </div>
);

SpatialEventTopicList.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  listData: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default SpatialEventTopicList;
