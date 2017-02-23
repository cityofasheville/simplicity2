import React from 'react';
import styles from '../../spatial_event_topic_list/spatialEventTopicListItemStyles.css';

const renderPermitTypeIcon = (PermitType) => {
  switch (PermitType) {
    case 'Residential':
      return (<span><i className="fa fa-home"></i> {PermitType}</span>);
    case 'Commercial':
      return (<span><i className="fa fa-building"></i> {PermitType}</span>);
    default:
      return (<span>{PermitType}</span>);
  }
};

const DevelopmentListItem = props => (
  <div>
    <div className="col-xs-12">
      <div className={['row', styles.flexRow, styles.titleRow].join(' ')}>
        <div className={['col-sm-3', styles.categoryTitle].join(' ')}>
          {renderPermitTypeIcon(props.itemData.PermitType)}
        </div>
        <div className={['col-sm-9', styles.categoryTitle].join(' ')}>
          <div className="pull-right">
            <span>{props.itemData.PermitName} - </span>
            <span>{props.itemData.PermitCategory} - </span>
            <span className={styles.itemLink}> <a title="Zoom to permit in map"><i className="fa fa-map-o"></i> {props.itemData.Address}</a></span>
          </div>
        </div>
      </div>
      <div className={['row', styles.flexRow].join(' ')}>
        <div className="col-sm-4">
          <span className={styles.columnTitle}>Opened:</span>
          <span className={styles.columnValue}> {props.itemData.AppliedDate}</span>
        </div>
        <div className="col-sm-4">
          <span className={styles.columnTitle}>Updated:</span>
          <span className={styles.columnValue}> {props.itemData.UpdatedDate}</span>
        </div>
        <div className="col-sm-4">
          <span className={styles.columnTitle}>Status:</span>
          <span className={styles.columnValue}> {props.itemData.CurrentStatus}</span>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className={['pull-right', styles.itemLink].join(' ')}> <a title="See permit details"><i className="fa fa-align-justify"></i> Permit details</a></div>
        </div>
      </div>
    </div>
  </div>
);

const itemDataShape = {
  PermitType: React.PropTypes.string,
  PermitSubtype: React.PropTypes.date,
  AppliedDate: React.PropTypes.date,
  UpdatedDate: React.PropTypes.date,
  PermitNum: React.PropTypes.string,
  PermitCategory: React.PropTypes.string,
  Address: React.PropTypes.string,
  PermitGroup: React.PropTypes.string,
  PermitName: React.PropTypes.string,
  CurrentStatus: React.PropTypes.string,
};

DevelopmentListItem.propTypes = {
  itemData: React.PropTypes.arrayOf(React.PropTypes.shape(itemDataShape)),
};

export default DevelopmentListItem;
