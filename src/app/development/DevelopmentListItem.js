import React from 'react';
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
            <div className="pull-right"><a title="View permit details"><i className="fa fa-align-justify"></i> Details</a></div><div className="pull-right"> <a title="View crime in map"><i className="fa fa-map-o"></i> Map</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const itemDataShape = {
  PermitType: React.PropTypes.string,
  PermitSubtype: React.PropTypes.string,
  AppliedDate: React.PropTypes.date,
  UpdatedDate: React.PropTypes.date,
  PermitNum: React.PropTypes.string,
  PermitCategory: React.PropTypes.string,
  Address: React.PropTypes.string,
  PermitGroup: React.PropTypes.string,
  PermitName: React.PropTypes.string,
  CurrentStatus: React.PropTypes.string,
  LicenseNumber: React.PropTypes.string,
  Contractor: React.PropTypes.string,
};

DevelopmentListItem.propTypes = {
  itemData: React.PropTypes.shape(itemDataShape).isRequired,
};

export default DevelopmentListItem;
