import React from 'react';
import Treemap from '../../../components/Treemap';

const dummyData = [
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

const getExplanatoryText = (categoryType) => {
  switch (categoryType) {
    case 'use':
      return 'Some explanatory text here describing the use treemap';
    case 'department':
      return 'Some explanatory text here describing the department treemap';
    default:
      return 'Some explanatory text goes here';
  }
};

const getButtonClass = (categoryType, buttonName) => {
  if (
    (categoryType === 'use' && buttonName === 'use') ||
    (categoryType === 'department' && buttonName === 'department')) {
    return 'btn btn-primary btn-xs active';
  }
  return 'btn btn-primary btn-xs';
};

const BudgetDetailsTreemap = props => (
  <div className="row">
    <div className="col-sm-12">
      <h3>Treemap of {props.expenditureOrRevenue}</h3>
      <div style={{ marginBottom: '15px' }}>
        {getExplanatoryText(props.categoryType)}<br />
        Click a rectangle in the treemap to go to a deeper level
      </div>
      <div className="btn-group pull-left" style={{ marginBottom: '3px' }}>
        <button className={getButtonClass(props.categoryType, 'use')}>Use</button>
        <button className={getButtonClass(props.categoryType, 'department')}>Departments</button>
      </div>
      <div className="btn-group pull-left" style={{ marginLeft: '3px' }}>
        <button className="btn btn-primary btn-xs"><i className="fa fa-arrow-up"></i></button>
      </div>
      <Treemap data={props.data} diveDeeper={props.diveDeeper} differenceColors />
    </div>
  </div>
);

BudgetDetailsTreemap.propTypes = {
  categoryType: React.PropTypes.string,
  expenditureOrRevenue: React.PropTypes.string,
  data: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  diveDeeper: React.PropTypes.func,
};

BudgetDetailsTreemap.defaultProps = {
  categoryType: 'use',
  expenditureOrRevenue: 'expentidures',
  data: dummyData,
};

export default BudgetDetailsTreemap;

