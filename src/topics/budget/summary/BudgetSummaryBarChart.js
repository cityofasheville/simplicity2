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

const getYearSpanFromSingleYear = year => (
  [year - 1, year.toString().slice(2)].join('-')
);

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
      <BarChart data={props.summaryData.dataValues} referenceArea xAxisDataKey="year" xReferenceAxisDataKey="yearAxisNumeric" referenceAreaLabels={['Actual', 'Adopted', 'Proposed']} referenceAreaExes={[500, 750, 1000]} barDataKeys={props.summaryData.dataKeys} yTickFormatter={getDollars} xTickFormatter={getYearSpanFromSingleYear} stacked dollars colorScheme={props.colorScheme} />
    </div>
  </div>
);

BudgetSummaryBarChart.propTypes = {
  categoryType: React.PropTypes.string,
  colorScheme: React.PropTypes.number,
  summaryData: React.PropTypes.object, // eslint-disable-line
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

