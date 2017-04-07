import React from 'react';
import { Link } from 'react-router';
import Treemap from '../../../components/Treemap';
import BarChart from '../../../components/BarChart';
import Sankey from '../../../components/Sankey';
import SimpleReactTable from '../../../components/SimpleReactTable';

const data = [
  {
    name: 'Police',
    size: 25554979,
    amount: 25554979,
    delta: 0.0,
    children: [
      { name: 'test', size: 130200 },
      { name: 'test2', size: 24539 },
      { name: 'test3', size: 652 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 27030 },
    ],
  },
  {
    name: 'Fire',
    size: 21944428,
    amount: 21944428,
    delta: -0.1,
    children: [
      { name: 'test', size: 13020 },
      { name: 'test2', size: 24539 },
      { name: 'test3', size: 6520 },
      { name: 'test4', size: 67030 },
      { name: 'test5', size: 27030 },
    ],
  },
  {
    name: 'Parks & Recreation',
    size: 10267618,
    amount: 10267618,
    delta: 0.1,
    children: [
      { name: 'test', size: 13020 },
      { name: 'test2', size: 24539 },
      { name: 'test3', size: 652 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 27030 },
    ],
  },
  {
    name: 'Admin Services/CMO',
    size: 2272155,
    amount: 2272155,
    delta: -0.25,
    children: [
      { name: 'test', size: 1302 },
      { name: 'test2', size: 2453 },
      { name: 'test3', size: 6502 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 2703 },
    ],
  },
  {
    name: 'General Services',
    size: 3142432,
    amount: 3142432,
    delta: 0.4,
    children: [
      { name: 'test', size: 1302 },
      { name: 'test2', size: 2453 },
      { name: 'test3', size: 652 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 9703 },
    ],
  },
  {
    name: 'Finance & Management',
    size: 3169881,
    amount: 3169881,
    delta: -0.5,
    children: [
      { name: 'test', size: 1302 },
      { name: 'test2', size: 2453 },
      { name: 'test3', size: 652 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 9703 },
    ],
  },
  {
    name: 'Human Resources',
    size: 1631166,
    amount: 1631166,
    delta: 0.6,
    children: [
      { name: 'test', size: 3020 },
      { name: 'test2', size: 2453 },
      { name: 'test3', size: 652 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 2703 },
      { name: 'test6', size: 1235 },
      { name: 'test8', size: 1245 },
    ],
  },
  {
    name: 'City Attorney',
    size: 982182,
    amount: 982182,
    delta: -0.8,
    children: [
      { name: 'test', size: 5000 },
      { name: 'test2', size: 5000 },
    ],
  },
  {
    name: 'Community & Economic Development',
    size: 2868484,
    amount: 2868484,
    delta: -0.1,
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
    name: 'Public Works',
    size: 9673331,
    amount: 9673331,
    delta: -0.7,
    children: [
      { name: 'test', size: 1302 },
      { name: 'test2', size: 4453 },
      { name: 'test3', size: 6520 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 2703 },
    ],
  },
  {
    name: 'Capital Projects & Sustainability',
    size: 1113281,
    amount: 1113281,
    delta: 0.9,
    children: [
      { name: 'test', size: 1302 },
      { name: 'test2', size: 4453 },
      { name: 'test3', size: 6520 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 2703 },
    ],
  },
  {
    name: 'Transportation',
    size: 2544905,
    amount: 2544905,
    delta: 0.7,
    children: [
      { name: 'test', size: 1302 },
      { name: 'test2', size: 4453 },
      { name: 'test3', size: 6520 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 2703 },
    ],
  },
  {
    name: 'Planning & Urban Design',
    size: 1094567,
    amount: 1094567,
    delta: -1.0,
    children: [
      { name: 'test', size: 1302 },
      { name: 'test2', size: 4453 },
      { name: 'test3', size: 6520 },
      { name: 'test4', size: 6703 },
      { name: 'test5', size: 2703 },
    ],
  },
  {
    name: 'Development Services',
    size: 4100544,
    amount: 4100544,
    delta: 0.26,
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

const areaData2 = {
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
          <div className="btn-group pull-right">
            <button className={props.location.query.view === 'summary' ? 'btn btn-primary active' : 'btn btn-primary'}><Link to={{ pathname: '/topics/budget', query: { entity: props.location.query.entity, view: 'summary', id: props.location.query.id, label: props.location.query.label } }}>Summary</Link></button>
            <button className={props.location.query.view === 'details' ? 'btn btn-primary active' : 'btn btn-primary'}><Link to={{ pathname: '/topics/budget', query: { entity: props.location.query.entity, view: 'details', id: props.location.query.id, label: props.location.query.label } }}>Details</Link></button></div>
          Budget
        </h1>
      </div>
    </div>
    <div className="row" hidden={props.location.query.view !== 'summary'}>
      <div className="col-sm-6">
        <h3>Budget breakdown by service area</h3>
        <p>
          Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart and accompanying table.
        </p>
        <div className="col-sm-12">
          <BarChart data={areaData.dataValues} xAxisDataKey="year" barDataKeys={areaData.dataKeys} tickFormatter={getDollars} stacked dollars />
        </div>
      </div>
      <div className="col-sm-6">
        <h3>Budget breakdown by department</h3>
        <p>
          Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart and accompanying table.
        </p>
        <div className="col-sm-12">
          <BarChart data={areaData2.dataValues} xAxisDataKey="year" barDataKeys={areaData2.dataKeys} tickFormatter={getDollars} stacked dollars colorScheme={1} />
        </div>
      </div>
    </div>
    <hr hidden={props.location.query.view !== 'summary'} />
    <div className="row" hidden={props.location.query.view !== 'summary'}>
      <div className="col-sm-12">
        <h3>Cash flow diagram: Revenues to expenditures</h3>
        <div style={{ marginBottom: '15px' }}>
          Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart.
        </div>
        <Sankey />
      </div>
    </div>
    <div className="row" hidden={props.location.query.view !== 'details'}>
      <div className="col-sm-12" style={{ marginBottom: '30px' }}>
        <h3>Treemap of expenditures</h3>
        <div style={{ marginBottom: '15px' }}>
          Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart.<br />
          Click a rectangle in the treemap to go to a deeper level
        </div>
        <div className="btn-group pull-left" style={{ marginBottom: '3px' }}>
          <button className="btn btn-success btn-xs">Service areas</button>
          <button className="btn btn-success btn-xs active">Departments</button>
        </div>
        <div className="btn-group pull-left" style={{ marginLeft: '3px' }}>
          <button className="btn btn-success btn-xs"><i className="fa fa-arrow-up"></i></button>
        </div>
        <Treemap data={data} diveDeeper={testFunc} differenceColors />
      </div>
    </div>
    <hr hidden={props.location.query.view !== 'details'} />
    <div className="row" hidden={props.location.query.view !== 'details'}>
      <div className="col-sm-12">
        <h3>Table of expenditures</h3>
        <div style={{ marginBottom: '15px' }}>
          Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart.<br />
          Click the triangles at left to expand rows for more detail.
        </div>
        <SimpleReactTable />
      </div>
    </div>
  </div>
);

BudgetSummary.propTypes = {
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default BudgetSummary;
