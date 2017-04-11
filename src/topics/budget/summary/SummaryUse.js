import React from 'react';
import BudgetSummaryBarChart from './BudgetSummaryBarChart';

const areaData = {
  dataKeys: [
    'Salaries & Wages',
    'Operating Costs',
    'Fringe Benefits',
    'Capital Outlay',
    'Debt Service',
    'test1',
    'test2',
  ],
  dataValues: [
    { year: '2013', 'Salaries & Wages': 58000000, 'Operating Costs': 44000000, 'Fringe Benefits': 24000000, 'Capital Outlay': 16463056, 'Debt Service': 12145694 },
    { year: '2014', 'Salaries & Wages': 59000000, 'Operating Costs': 44123456, 'Fringe Benefits': 23000000, 'Capital Outlay': 16463056, 'Debt Service': 12145694 },
    { year: '2015', 'Salaries & Wages': 59312345, 'Operating Costs': 48000000, 'Fringe Benefits': 23412345, 'Capital Outlay': 14500000, 'Debt Service': 12145694 },
    { year: '2016', 'Salaries & Wages': 60003234, 'Operating Costs': 42123456, 'Fringe Benefits': 27000000, 'Capital Outlay': 12000000, 'Debt Service': 12145694 },
    { year: '2017', 'Salaries & Wages': 61574371, 'Operating Costs': 46337004, 'Fringe Benefits': 24973691, 'Capital Outlay': 16463056, 'Debt Service': 10145694, test1: 7000000, test2: 10000000 },
  ],
};

const SummaryUse = props => (
  <div className="row">
    <div className="col-sm-12">
      <BudgetSummaryBarChart categoryType={'use'} data={areaData} />
    </div>
  </div>
);

SummaryUse.propTypes = {
  data: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SummaryUse.defaultProps = {
  data: {},
};

export default SummaryUse;
