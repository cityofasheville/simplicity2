import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../shared/Icon';
import { IM_MAP5, IM_PARAGRAPH_JUSTIFY3 } from '../../shared/iconConstants';
import styles from '../spatial_event_topic_summary/spatialEventTopicListItemStyles.css';


const DevelopmentListItem = (props) => {
  const displayItems = {
    'Permit type': props.itemData.PermitType,
    Updated: props.itemData.UpdatedDate,
    'Permit #': props.itemData.PermitNum,
    Category: props.itemData.PermitCategory,
    Status: props.itemData.CurrentStatus,
    Contractor: props.itemData.Contractor,
  };

  return (
    <div>
      <div className="col-xs-12">
        <div className={['row', styles.flexRow, styles.titleRow].join(' ')}>
          <div className={['col-sm-8', styles.categoryTitle].join(' ')}>
            <span>{props.itemData.PermitName}</span>
          </div>
          <div className={['col-sm-4', styles.categoryTitle].join(' ')}>
            <div className="pull-right">
              <label htmlFor="applied_date" className="control-label">Applied date:</label>
              <span name="applied_date"> {props.itemData.AppliedDate}</span>
            </div>
          </div>
        </div>
        <div className={['row', styles.addressRow].join(' ')}>
          <div className="col-sm-12">
            <span className={styles.itemLink}>{props.itemData.Address}</span>
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
            <div className="pull-right"><a title="View permit details" style={{ marginLeft: '7px' }}><Icon path={IM_PARAGRAPH_JUSTIFY3} size={20} /> Details</a></div><div className="pull-right"><a title="View in map"><Icon path={IM_MAP5} size={20} /> Map</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const itemDataShape = {
  PermitType: PropTypes.string,
  PermitSubtype: PropTypes.string,
  AppliedDate: PropTypes.date,
  UpdatedDate: PropTypes.date,
  PermitNum: PropTypes.string,
  PermitCategory: PropTypes.string,
  Address: PropTypes.string,
  PermitGroup: PropTypes.string,
  PermitName: PropTypes.string,
  CurrentStatus: PropTypes.string,
  LicenseNumber: PropTypes.string,
  Contractor: PropTypes.string,
};

DevelopmentListItem.propTypes = {
  itemData: PropTypes.shape(itemDataShape).isRequired,
};

export default DevelopmentListItem;
