import React from 'react';
import styles from '../../spatial_event_topic_list/spatialEventTopicListItemStyles.css';

const CrimeListItem = (props) => {
  const displayItems = {
    'Case #': props.itemData.caseNumber,
    'Law beat': props.itemData.lawBeat,
  };

  return (
    <div>
      <div className="col-xs-12">
        <div className={['row', styles.flexRow, styles.titleRow].join(' ')}>
          <div className={['col-sm-8', styles.categoryTitle].join(' ')}>
            <span>{props.itemData.crime}</span>
          </div>
          <div className={['col-sm-4', styles.categoryTitle].join(' ')}>
            <div className="pull-right">
              {props.itemData.date}
            </div>
          </div>
        </div>
        <div className={['row', styles.addressRow].join(' ')}>
          <div className="col-sm-12">
            <span className={styles.columnTitle}>{props.itemData.location}</span>
            <div className="pull-right"> <a title="View crime in map"><i className="fa fa-map-o"></i> View crime in map</a></div>
          </div>
        </div>
        <div className={['row', styles.flexRow].join(' ')}>
          {Object.keys(displayItems).map(key => (
            <div className="col-sm-6" key={key}>
              <label htmlFor={key} className={['control-label', styles.columnTitle].join(' ')}>{key}:</label>
              <span className={styles.columnValue} name={key}> {displayItems[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
