import React from 'react';
import PropertyListItem from './PropertyListItem';
import styles from '../spatial_event_topic_summary/spatialEventTopicListStyles.css';

const PropertyList = props => (
  <div className={styles.topicSummaryList}>
    {props.listData.map((itemData, i) => (
      <PropertyListItem key={['property', i].join('_')} itemData={itemData} />
    ))}
  </div>
);

const itemDataShape = {
  PropertyName: React.PropTypes.string,
  CivicAddressID: React.PropTypes.string,
  PIN: React.PropTypes.date,
};

PropertyList.propTypes = {
  listData: React.PropTypes.arrayOf(React.PropTypes.shape(itemDataShape)).isRequired,
};

export default PropertyList;
