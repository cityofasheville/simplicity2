/**
*
* DashboardValueRange
*
*/

import React from 'react';


import styles from './dashboardValueRangeStyles.css';

const DashboardValueRange = (props) => (
    <div className={['col-xs-12', 'col-sm-6', 'col-md-4', 'col-lg-3', styles.dashboardValueRangeOuter].join(' ')}>
      <div className={['col-xs-12', styles.dashboardValueRangeInner].join(' ')}>
        <div className={['row', 'text-center', styles.dashboardValueRangeWrapper].join(' ')}>
          <span className={['col-xs-4', styles.dashboardValueWrapper].join(' ')}>
            <h3 className="text-center text-muted">{props.minValue}</h3>
            <small className="text-center">MIN</small>
          </span>
          <span className={['col-xs-4', styles.dashboardValueWrapper].join(' ')}>
            <h1 className="text-center text-primary">{props.medValue}</h1>
            <small className="text-center">MED</small>
          </span>
          <span className={['col-xs-4', styles.dashboardValueWrapper].join(' ')}>
            <h3 className="text-center text-muted">{props.maxValue}</h3>
            <small className="text-center">MAX</small>
          </span>
        </div>
        <h5 className="text-center text-primary">{props.label}</h5>
      </div>
    </div>
);


export default DashboardValueRange;
