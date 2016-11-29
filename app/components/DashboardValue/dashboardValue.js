/**
*
* DashboardValue
*
*/

import React from 'react';

import styles from './dashboardValueStyles.css';

const DashboardValue = (props) => (
    <div className={['col-xs-12', 'col-sm-6', 'col-md-4', 'col-lg-3', styles.dashboardValueOuter].join(' ')}>
      <div className={['col-xs-12', styles.dashboardValueInner].join(' ')}>
        <div className={['col-xs-12', 'text-center', styles.dashboardValueWrapper].join(' ')}>
          <h1 className="text-center text-primary">{props.value}</h1>
          <h4 className="text-center text-muted">{props.subValue}</h4>
        </div>
        <h5 className={['text-center', 'text-primary', styles.dashboardValueLabel].join(' ')}>{props.label}</h5>
      </div>
    </div>
);


export default DashboardValue;
