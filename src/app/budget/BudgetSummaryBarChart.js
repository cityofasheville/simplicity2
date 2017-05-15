import React from 'react';
import { connect } from 'react-redux';
import BarChart from '../../shared/visualization/BarChart';

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
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
    <div className="row">
      <div className="col-xs-9 col-xs-offset-2">
        <h3 className="text-center">Spending {getTitle(props.categoryType)}</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <BarChart data={props.summaryData.dataValues} referenceArea xAxisDataKey="display_year" xReferenceAxisDataKey="yearAxisNumeric" referenceAreaLabels={[['Actual', 'Spent'], ['Adopted', 'Budget'], ['Proposed', 'Budget']]} referenceAreaExes={[500, 750, 1000]} barDataKeys={props.summaryData.dataKeys} yTickFormatter={getDollars} stacked dollars colorScheme={props.colorScheme} />
        <span className="pull-right" style={{ fontSize: '12px' }}>Barchart totals exclude interfund transfers</span>
      </div>
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

