import React from 'react';
import styles from '../../spatial_event_topic_list/spatialEventTopicListItemStyles.css';

const CrimeListItem = props => (
  <div>
    <div className="col-xs-12">
      <div className={['row', styles.flexRow, styles.titleRow].join(' ')}>
        <div className={['col-sm-4', styles.categoryTitle].join(' ')}>
          <span>{props.itemData.crime}</span>
        </div>
        <div className={['col-sm-8', styles.categoryTitle].join(' ')}>
          <div className="pull-right">
            <span>{props.itemData.date} - </span>
            <span className={styles.itemLink}> <a title="Zoom to crime in map"><i className="fa fa-map-o"></i> {props.itemData.location}</a></span>
          </div>
        </div>
      </div>
      <div className={['row', styles.flexRow].join(' ')}>
        <div className="col-sm-6">
          <span className={styles.columnTitle}>Case #:</span>
          <span className={styles.columnValue}> {props.itemData.caseNumber}</span>
        </div>
        <div className="col-sm-6">
          <span className={styles.columnTitle}>Law beat:</span>
          <span className={styles.columnValue}> {props.itemData.lawBeat}</span>
        </div>
      </div>
    </div>
  </div>
);

CrimeListItem.propTypes = {
  itemData: React.PropTypes.shape({
    crime: React.PropTypes.string,
    location: React.PropTypes.location,
    date: React.PropTypes.date,
    caseNumber: React.PropTypes.string,
    lawBeat: React.PropTypes.string,
  }).isRequired,
};

export default CrimeListItem;
