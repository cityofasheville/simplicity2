import React from 'react';
import MaintenanceListItem from './MaintenanceListItem';
import styles from '../../topics/spatial_event_topic_list/spatialEventTopicListStyles.css';

const MaintenanceList = props => (
  <div className={styles.topicSummaryList}>
    {props.listData.map((itemData, i) => (
      <MaintenanceListItem key={['property', i].join('_')} itemData={itemData} />
    ))}
  </div>
);

const itemDataShape = {
  AuthorityName: React.PropTypes.string,
  CenterlineID: React.PropTypes.string,
  Street: React.PropTypes.string,
};

MaintenanceList.propTypes = {
  listData: React.PropTypes.arrayOf(React.PropTypes.shape(itemDataShape)).isRequired,
};

export default MaintenanceList;
