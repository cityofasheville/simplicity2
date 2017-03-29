import React from 'react';
import styles from '../../topics/spatial_event_topic_list/spatialEventTopicListItemStyles.css';

const getAuthoritySite = (authority) => {
  switch (authority) {
    case 'NCDOT':
      return 'https://apps.ncdot.gov/contactus/PostComment.aspx?Unit=PIO';
    case 'CITY OF ASHEVILLE':
      return 'http://www.ashevillenc.gov/departments/street_services/maintenance.htm';
    default:
      return '/';
  }
};

const MaintenanceListItem = (props) => {
  const displayItems = {
    Name: props.itemData.Street,
    'Centerline ID': props.itemData.CenterlineID,
  };

  return (
    <div className={['row', styles.topicSummaryListItem].join(' ')}>
      <div className="col-xs-12">
        <div className={['row', styles.flexRow, styles.titleRow].join(' ')}>
          <div className={['col-sm-12', styles.categoryTitle].join(' ')}>
            <span>{props.itemData.AuthorityName}</span>
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
            <div className="pull-right"><a title="Report an issue"><i className="fa fa-exclamation-triangle"></i> Report an issue</a></div><div className="pull-right"> <a title="View directions to property in Google maps" href={getAuthoritySite(props.itemData.AuthorityName)} target="_blank"><i className="fa fa-info-circle"></i> Authority website</a></div><div className="pull-right"> <a title="View centerline in map"><i className="fa fa-map-o"></i> Map</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const itemDataShape = {
  AuthorityName: React.PropTypes.string,
  CenterlineID: React.PropTypes.string,
  Street: React.PropTypes.string,
};

MaintenanceListItem.propTypes = {
  itemData: React.PropTypes.shape(itemDataShape).isRequired,
};

export default MaintenanceListItem;
