import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../shared/Icon';
import { IM_MAP5 } from '../../shared/iconConstants';
import styles from '../spatial_event_topic_summary/spatialEventTopicListItemStyles.css';

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
        <div className={['row', styles.linkRow].join(' ')}>
          <div className="col-sm-12">
            <div className="pull-right"> <a title="View crime in map"><Icon path={IM_MAP5} size={20} /> Map</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

CrimeListItem.propTypes = {
  itemData: PropTypes.shape({
    crime: PropTypes.string,
    location: PropTypes.location,
    date: PropTypes.date,
    caseNumber: PropTypes.string,
    lawBeat: PropTypes.string,
  }).isRequired,
};

export default CrimeListItem;
