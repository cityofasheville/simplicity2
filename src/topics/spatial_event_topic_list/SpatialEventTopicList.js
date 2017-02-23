import React from 'react';
import SpatialEventTopicListItem from './SpatialEventTopicListItem';
import styles from './spatialEventTopicListStyles.css';

const testListData = [
  { crime: 'Larceny', location: '123 Main Street', date: '01/01/2001', caseNumber: '1234567879', lawBeat: 'AC2', severity: 'Property' },
  { crime: 'Larceny of Motor Vehicle', location: '10 Main Street', date: '01/01/2002', caseNumber: '11111', lawBeat: 'AC3', severity: 'Property' },
  { crime: 'Larceny', location: '1 Main Street', date: '05/01/2001', caseNumber: '9999999', lawBeat: 'AC6', severity: 'Property' },
  { crime: 'Larceny', location: '12 Main Street', date: '06/16/2001', caseNumber: 'X12354999', lawBeat: 'AC3', severity: 'Property' },
  { crime: 'Larceny', location: '1234 Main Street', date: '01/01/2001', caseNumber: '00009990', lawBeat: 'AC2', severity: 'Property' },
];

const SpatialEventTopicList = props => (
  <div className="col-xs-12">
    <div className={styles.topicSummaryList}>
      {testListData.map((itemData, i) => (
        <SpatialEventTopicListItem key={i} itemData={itemData} spatialEventTopic={props.spatialEventTopic} />
      ))}
    </div>
  </div>
);

SpatialEventTopicList.propTypes = {
  spatialEventTopic: React.PropTypes.string.isRequired,
};

export default SpatialEventTopicList;
