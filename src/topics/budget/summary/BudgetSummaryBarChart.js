import React from 'react';
import BarChart from '../../../components/BarChart';

const getDollars = (value) => {
  if (value > 1000000) {
    return ['$', (value / 1000000).toLocaleString(), ' M'].join('');
  } else if (value > 1000) {
    return ['$', (value / 1000).toLocaleString(), ' k'].join('');
  }
  return ['$', value.toLocaleString()].join('');
};

const getExplanatoryText = (categoryType) => {
  switch (categoryType) {
    case 'use':
      return 'Some explanatory text here describing the use bar chart';
    case 'department':
      return 'Some explanatory text here describing the department breakdown chart';
    default:
      return 'Some explanatory text goes here';
  }
};

const getTitle = (categoryType) => {
  switch (categoryType) {
    case 'use':
      return 'by use';
    case 'department':
      return 'by department';
    default:
      return '';
  }
};

const BudgetSummaryBarChart = props => (
  <div>
    <h3>Budget breakdown {getTitle(props.categoryType)}</h3>
    <p>
      {getExplanatoryText(props.categoryType)}
    </p>
    <div className="col-sm-12">
      <BarChart data={props.data.dataValues} xAxisDataKey="year" barDataKeys={props.data.dataKeys} tickFormatter={getDollars} stacked dollars colorScheme={props.colorScheme} />
    </div>
  </div>
);

BudgetSummaryBarChart.propTypes = {
  categoryType: React.PropTypes.string,
  colorScheme: React.PropTypes.number,
  data: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

BudgetSummaryBarChart.defaultProps = {
  categoryType: 'use',
  colorScheme: 0,
  data: {},
};

export default BudgetSummaryBarChart;

