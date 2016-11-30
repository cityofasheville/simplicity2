/**
*
* DashboardPerformanceSummary
*
*/

import React from 'react';


import styles from './dashboardPerformanceSummaryStyles.css';

function DashboardPerformanceSummary() {
  return (
    <div className={styles.dashboardPerformanceSummary}>
      <div className="table-responsive">
        <table className={['table', 'table-bordered', 'table-striped'].join(' ')}>
          <thead>
            <tr>
              <th>SLA Metrics</th>
              <th className="text-center">1 Day</th>
              <th className="text-center">3 Day</th>
              <th className="text-center">10 Day</th>
              <th className="text-center">21 Day</th>
              <th className="text-center">30 Day</th>
              <th className="text-center">45 Day</th>
              <th className="text-center">90 Day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>% Permits that Failed SLA</td>
              <td className="text-center"><i className="fa fa-check-circle fa-2x text-success"></i></td>
              <td className="text-center"><i className="fa fa-exclamation-triangle fa-2x text-warning"></i></td>
              <td className="text-center"><i className="fa fa-check-circle fa-2x text-center text-success"></i></td>
              <td className="text-center"><i className="fa fa-exclamation-triangle fa-2x text-warning"></i></td>
              <td className="text-center"><i className="fa fa-check-circle fa-2x text-success"></i></td>
              <td className="text-center"><i className="fa fa-times-circle fa-2x text-danger"></i></td>
              <td className="text-center"><i className="fa fa-check-circle fa-2x text-success"></i></td>
            </tr>
            <tr>
              <td>Median Days Late</td>
              <td className="text-center"><i className="fa fa-check-circle fa-2x text-center text-success"></i></td>
              <td className="text-center"><i className="fa fa-exclamation-triangle fa-2x text-warning"></i></td>
              <td className="text-center"><i className="fa fa-exclamation-triangle fa-2x text-warning"></i></td>
              <td className="text-center"><i className="fa fa-check-circle fa-2x text-center text-success"></i></td>
              <td className="text-center"><i className="fa fa-check-circle fa-2x text-center text-success"></i></td>
              <td className="text-center"><i className="fa fa-times-circle fa-2x text-danger"></i></td>
              <td className="text-center"><i className="fa fa-times-circle fa-2x text-danger"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardPerformanceSummary;
