import React from 'react';
import styles from '../../spatial_event_topic_list/spatialEventTopicListItemStyles.css';

const CrimeListItem = props => (
  <div>
    <div className="col-xs-12">
      <div className="row">
        <span className={['col-sm-8 col-xs-12', styles.categoryTitle].join(' ')}>{props.itemData.crime}</span>
        <span className={['col-sm-4 col-xs-12', styles.mapLink, styles.centeredCol].join(' ')}>
          <a><i className="fa fa-map-o"></i> Zoom to crime in map</a>
        </span>
        <span className={['col-sm-8 col-xs-12', styles.listTitle].join(' ')}>{props.itemData.location}</span>
        <span className={['col-sm-4 col-xs-12', styles.listSubTitle, styles.centeredCol].join(' ')}>{props.itemData.date}</span>
      </div>
      <hr />
      <div className={['row', styles.flexRow].join(' ')}>
        <div className={['col-sm-4', styles.centeredCol].join(' ')}>
          <span className={styles.columnTitle}>Case #<br /></span>
          <span className={styles.columnValue}>{props.itemData.caseNumber}</span>
        </div>
        <div className={['col-sm-4', styles.centeredCol].join(' ')}>
          <span className={styles.columnTitle}>Law beat<br /></span>
          <span className={styles.columnValue}>{props.itemData.lawBeat}</span>
        </div>
        <div className={['col-sm-4', styles.centeredCol].join(' ')}>
          <span className={styles.columnTitle}>Severity<br /></span>
          <span className={styles.columnValue}>{props.itemData.severity}</span>
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
    severity: React.PropTypes.string,
  }).isRequired,
};

export default CrimeListItem;
