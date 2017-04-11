import React from 'react';
import BudgetSummaryBarChart from './BudgetSummaryBarChart';

const areaData = {
  dataKeys: [
    'Police',
    'Fire',
    'Parks & Recreation',
    'Public Works',
    'Admin Services',
    'Other',
    'test3',
  ],
  dataValues: [
    { year: '2013', Police: 48000000, Fire: 15000000, 'Parks & Recreation': 12000000, 'Public Works': 24000000, 'Admin Services': 16463056, Other: 33000000 },
    { year: '2014', Police: 49000000, Fire: 16000000, 'Parks & Recreation': 12000000, 'Public Works': 23000000, 'Admin Services': 16463056, Other: 33000000 },
    { year: '2015', Police: 59312345, Fire: 48000000, 'Parks & Recreation': 12000000, 'Public Works': 23412345, 'Admin Services': 14500000, Other: 8000000 },
    { year: '2016', Police: 60003234, Fire: 42123456, 'Parks & Recreation': 12000000, 'Public Works': 27000000, 'Admin Services': 12000000, Other: 8000000 },
    { year: '2017', Police: 61574371, Fire: 46337004, 'Parks & Recreation': 12000000, 'Public Works': 24973691, 'Admin Services': 16463056, Other: 7000000, test3: 5000000 },
  ],
};

const SummaryDepartments = props => (
  <div className="row">
    <div className="col-sm-12">
      <BudgetSummaryBarChart categoryType={'department'} colorScheme={1} data={areaData} />
    </div>
  </div>
);

SummaryDepartments.propTypes = {
  data: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SummaryDepartments.defaultProps = {
  data: {},
};

export default SummaryDepartments;
