import React from 'react';
import Treemap from '../../../components/Treemap';
import AreaChart from '../../../components/AreaChart';

const data = [
  { name: 'Salaries & Wages', size: 122009, amount: 61574371 },
  { name: 'Operating Costs', size: 91816, amount: 46337004 },
  { name: 'Fringe Benefits', size: 49485, amount: 24973691 },
  { name: 'Capital Outlay', size: 32621, amount: 16463056 },
  { name: 'Debt Service', size: 24066, amount: 12145694 },
];

const areaData = {
  dataKeys: [
    'Salaries & Wages',
    'Operating Costs',
    'Fringe Benefits',
    'Capital Outlay',
    'Debt Service',
  ],
  dataValues: [
    { year: '2013', 'Salaries & Wages': 58000000, 'Operating Costs': 44000000, 'Fringe Benefits': 24000000, 'Capital Outlay': 16463056, 'Debt Service': 12145694 },
    { year: '2014', 'Salaries & Wages': 59000000, 'Operating Costs': 44123456, 'Fringe Benefits': 23000000, 'Capital Outlay': 16463056, 'Debt Service': 12145694 },
    { year: '2015', 'Salaries & Wages': 59312345, 'Operating Costs': 48000000, 'Fringe Benefits': 23412345, 'Capital Outlay': 14500000, 'Debt Service': 12145694 },
    { year: '2016', 'Salaries & Wages': 60003234, 'Operating Costs': 42123456, 'Fringe Benefits': 27000000, 'Capital Outlay': 12000000, 'Debt Service': 12145694 },
    { year: '2017', 'Salaries & Wages': 61574371, 'Operating Costs': 46337004, 'Fringe Benefits': 24973691, 'Capital Outlay': 16463056, 'Debt Service': 12145694 },
  ],
};

const testFunc = (args) => {
  console.log(args);
};

const BudgetSummary = props => (
  <div>
    <div className="row">
      <h1>Budget</h1>
    </div>
    <div className="row">
      <Treemap data={data} diveDeeper={testFunc} />
    </div>
    <div className="row" style={{ marginTop: '10px' }}>
      <div className="col-sm-5">
        Some summary to go along with area chart.
      </div>
      <div className="col-sm-7">
        <AreaChart data={areaData} diveDeeper={testFunc} />
      </div>
    </div>
  </div>
);

BudgetSummary.propTypes = {

};

export default BudgetSummary;
