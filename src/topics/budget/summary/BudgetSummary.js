import React from 'react';
import Treemap from '../../../components/Treemap';
import AreaChart from '../../../components/AreaChart';
import BarChart from '../../../components/BarChart';
import Sankey from '../../../components/Sankey';
import DetailsTable from '../../../components/DetailsTable';
import Select from '../../../components/Select';

const data = [
  {
    name: 'Salaries & Wages',
    size: 122009,
    amount: 61574371,
    delta: -0.5,
    children: [
      { name: 'test', size: 13020 },
      { name: 'test2', size: 24539 },
      { name: 'test3', size: 652 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 27030 },
    ],
  },
  {
    name: 'Operating Costs',
    size: 91816,
    amount: 46337004,
    delta: 0.7,
    children: [
      { name: 'test', size: 13020 },
      { name: 'test2', size: 24539 },
      { name: 'test3', size: 652 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 27030 },
      { name: 'test6', size: 12345 },
      { name: 'test7', size: 124 },
      { name: 'test8', size: 12345 },
    ],
  },
  {
    name: 'Fringe Benefits',
    size: 49485,
    amount: 24973691,
    delta: -0.15,
    children: [
      { name: 'test', size: 1235 },
      { name: 'test2', size: 1235 },
      { name: 'test3', size: 123 },
      { name: 'test4', size: 12345 },
      { name: 'test5', size: 2703 },
      { name: 'test5', size: 27000 },
      { name: 'test6', size: 1234 },
      { name: 'test7', size: 124 },
      { name: 'test8', size: 1234 },
    ],
  },
  {
    name: 'Capital Outlay',
    size: 32621,
    amount: 16463056,
    delta: 1.5,
    children: [
      { name: 'test', size: 1235 },
      { name: 'test2', size: 1235 },
      { name: 'test3', size: 123 },
      { name: 'test4', size: 1234 },
      { name: 'test5', size: 1703 },
      { name: 'test5', size: 2700 },
      { name: 'test6', size: 2234 },
      { name: 'test7', size: 1240 },
      { name: 'test8', size: 12344 },
    ],
  },
  {
    name: 'Debt Service',
    size: 24066,
    amount: 12145694,
    delta: 0.0,
    children: [
      { name: 'test', size: 1302 },
      { name: 'test2', size: 4453 },
      { name: 'test3', size: 6520 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 2703 },
    ],
  },
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

const years = {
  options: [
    { value: '2013', display: '2013' },
    { value: '2014', display: '2014' },
    { value: '2015', display: '2015' },
    { value: '2016', display: '2016' },
    { value: '2017', display: '2017' },
  ],
  value: '2017',
  name: 'year',
  id: 'id',
};

const detailsColumns = [
  { title: 'Category', name: 'category' },
  { title: 'Value', name: 'value' },
  { title: 'Change from previous year', name: 'delta' },  
];

const detailsData = [
  { category: 'Salaries & wages', value: '$61,574,371', delta: '-50%' },
  { category: 'Operating costs', value: '$46,337,004', delta: '+70%' },
  { category: 'Fringe benefits', value: '$24,973,691', delta: '-15%' },
  { category: 'Capital outlay', value: '$16,463,056', delta: '+150%' },
  { category: 'Debt service', value: '$12,145,694', delta: '0%' },
];

const testFunc = (args) => {
  console.log(args);
};

const getDollars = (value) => {
  if (value > 1000000) {
    return ['$', (value / 1000000).toLocaleString(), ' M'].join('');
  } else if (value > 1000) {
    return ['$', (value / 1000).toLocaleString(), ' k'].join('');
  }
  return ['$', value.toLocaleString()].join('');
};

const BudgetSummary = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>
          <div className="btn-group pull-right" style={{ marginBottom: '20px' }}><button className="btn btn-primary active">Expenses</button><button className="btn btn-primary">Revenues</button><button className="btn btn-primary">Funds &amp; Reserves</button></div>
          Budget
        </h1>
      </div>
    </div>
    <div className="row" style={{ marginTop: '35px' }}>
      <div className="col-sm-12">
        <div className="text-muted lead">
          Click a division in the area chart to zoom to that budget category
        </div>
      </div>
      <div className="col-sm-6">
        <AreaChart data={areaData} diveDeeper={testFunc} />
      </div>
      <div className="col-sm-6">
        <div className="form-group">
          <label htmlFor="years" className="control-label-inline">Details for</label>
          <Select id={years.id} name={years.name} options={years.options} value={years.value} />
        </div>
        <div className="form-group" style={{ marginTop: '15px' }}>
          <fieldset className="detailsFieldset">
            <DetailsTable columns={detailsColumns} data={detailsData} />
          </fieldset>
        </div>
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <div className="text-muted lead">
          Click a bar segment in the bar chart to zoom to that budget category
        </div>
      </div>
      <div className="col-sm-6">
        <div className="form-group">
          <label htmlFor="years" className="control-label-inline">Details for</label>
          <Select id={years.id} name={years.name} options={years.options} value={years.value} />
        </div>
        <div className="form-group" style={{ marginTop: '15px' }}>
          <fieldset className="detailsFieldset">
            <DetailsTable columns={detailsColumns} data={detailsData} />
          </fieldset>
        </div>
      </div>
      <div className="col-sm-6">
        <BarChart data={areaData.dataValues} xAxisDataKey="year" barDataKeys={areaData.dataKeys} tickFormatter={getDollars} stacked />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <div className="text-muted lead">
          Click a bar in the bar chart to zoom to that budget category
        </div>
      </div>
      <div className="col-sm-6">
        <BarChart data={areaData.dataValues} xAxisDataKey="year" barDataKeys={areaData.dataKeys} tickFormatter={getDollars} />
      </div>
      <div className="col-sm-6">
        <div className="form-group">
          <label htmlFor="years" className="control-label-inline">Details for</label>
          <Select id={years.id} name={years.name} options={years.options} value={years.value} />
        </div>
        <div className="form-group" style={{ marginTop: '15px' }}>
          <fieldset className="detailsFieldset">
            <DetailsTable columns={detailsColumns} data={detailsData} />
          </fieldset>
        </div>
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <div className="text-muted lead">
          Click a section of the treemap below to see more details
        </div>
        <Treemap data={data} diveDeeper={testFunc} differenceColors />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <div className="text-muted lead">
          Click a section of the treemap below to see more details
        </div>
        <Treemap data={data} diveDeeper={testFunc} />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <div className="text-muted lead">
          Cash flow diagram
        </div>
        <Sankey />
      </div>
    </div>
  </div>
);

BudgetSummary.propTypes = {

};

export default BudgetSummary;
