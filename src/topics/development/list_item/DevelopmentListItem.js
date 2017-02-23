import React from 'react';
import styles from '../../spatial_event_topic_list/spatialEventTopicListItemStyles.css';

const DevelopmentListItem = props => (
  <div className={['row', styles.topicSummaryListItem].join(' ')}>
    <div className="col-xs-12">
    </div>
  </div>
);

const itemDataShape = {
  permitType: React.PropTypes.string,
  location: React.PropTypes.string,
  date: React.PropTypes.date,
};

DevelopmentListItem.propTypes = {
  itemData: React.PropTypes.arrayOf(React.PropTypes.shape(itemDataShape)),
};

export default DevelopmentListItem;
