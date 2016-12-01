/**
*
* DashboardPerformanceSummary
*
*/

import React from 'react';


import styles from './dashboardPerformanceSummaryStyles.css';

const renderTitle = (title) => (
  <div className={styles.titleWrapper}>
    <h1 className={styles.title}>{title}</h1>
  </div>
);

const renderStatusIcon = (status) => {
  if (status === 'success') {
    return (
      <h1><i className="fa fa-check-circle text-success"></i></h1>
    );
  } else if (status === 'warning') {
    return (
      <h1><i className="fa fa-exclamation-triangle text-warning"></i></h1>
    );
  }
  return null;
};

const renderSummaryDetail = (detailId, detailValue, detailLabel, detailStatus) => (
  <div key={detailId} className={['col-xs-6', 'text-center', styles[detailStatus]].join(' ')}>
    <h3>{detailValue}</h3>
    <small>{detailLabel}</small>
  </div>
);


const DashboardPerformanceSummary = (props) => (
  <div className={['row', styles.dashboardPerformanceSummary].join(' ')}>
    {
      props.summary.map((summary) => (
        <div key={summary.id} className="col-md-3 col-sm-6">
          <div className={['col-xs-12', 'text-center', styles.summaryWrapper].join(' ')}>
            {renderTitle(summary.summaryTitle)}
            {renderStatusIcon(summary.summaryStatus)}
            <div className={['row', styles.summaryDetailsWrapper].join(' ')}>
            {
              summary.summaryDetails.map((detail) => (
                renderSummaryDetail(detail.id, detail.detailValue, detail.detailLabel, detail.detailStatus)
              ))
            }
            </div>
          </div>
        </div>
      ))
    }
  </div>
);

DashboardPerformanceSummary.propTypes = {
  summary: React.PropTypes.array.isRequired,
};

export default DashboardPerformanceSummary;
