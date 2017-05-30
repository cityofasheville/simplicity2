import React from 'react';
import PropTypes from 'prop-types';
import MaintenanceListItem from './MaintenanceListItem';
import styles from '../spatial_event_topic_summary/spatialEventTopicListStyles.css';

const MaintenanceList = props => (
  <div className={styles.topicSummaryList}>
    {props.listData.map((itemData, i) => (
      <MaintenanceListItem key={['property', i].join('_')} itemData={itemData} />
    ))}
  </div>
);

const itemDataShape = {
  AuthorityName: PropTypes.string,
  CenterlineID: PropTypes.string,
  Street: PropTypes.string,
};

MaintenanceList.propTypes = {
  listData: PropTypes.arrayOf(PropTypes.shape(itemDataShape)).isRequired,
};

export default MaintenanceList;
