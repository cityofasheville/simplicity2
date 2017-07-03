import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../shared/Icon';
import { IM_WARNING, IM_INFO, IM_MAP5 } from '../../shared/iconConstants';
import styles from '../spatial_event_topic_summary/spatialEventTopicListItemStyles.css';

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
            <div className="pull-right"><a title="Report an issue" style={{ marginLeft: '7px' }}><Icon path={IM_WARNING} size={20} /> Report an issue</a></div><div className="pull-right"> <a title="View directions to property in Google maps" href={getAuthoritySite(props.itemData.AuthorityName)} target="_blank" style={{ marginLeft: '7px' }}><Icon path={IM_INFO} size={20} /> Authority website</a></div><div className="pull-right"> <a title="View centerline in map"><Icon path={IM_MAP5} size={20} /> Map</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const itemDataShape = {
  AuthorityName: PropTypes.string,
  CenterlineID: PropTypes.string,
  Street: PropTypes.string,
};

MaintenanceListItem.propTypes = {
  itemData: PropTypes.shape(itemDataShape).isRequired,
};

export default MaintenanceListItem;
