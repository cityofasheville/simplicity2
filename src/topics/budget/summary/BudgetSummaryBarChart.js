import React from 'react';
import { connect } from 'react-redux';
import BarChart from '../../../components/BarChart';

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
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
      <BarChart data={props.summaryData.dataValues} xAxisDataKey="year" barDataKeys={props.summaryData.dataKeys} tickFormatter={getDollars} stacked dollars colorScheme={props.colorScheme} />
    </div>
  </div>
);

BudgetSummaryBarChart.propTypes = {
  categoryType: React.PropTypes.string,
  colorScheme: React.PropTypes.number,
};

BudgetSummaryBarChart.defaultProps = {
  categoryType: 'use',
  colorScheme: 0,
};

const mapStateToProps = (state, ownProps) => (
  {
    summaryData: ownProps.categoryType === 'use' ? state.budget.summaryUseData : state.budget.summaryDeptData,
  }
);

export default connect(mapStateToProps)(BudgetSummaryBarChart);

