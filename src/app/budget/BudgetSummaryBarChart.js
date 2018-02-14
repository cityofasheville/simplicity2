import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import { getBudgetSummaryDept, getBudgetSummaryUse } from './graphql/budgetQueries';

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
};

const getDollarsLong = value => (
  [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
);

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

const getLongDesc = data => (
  <div>
    {data.dataValues.map((value, index) => (
      <div key={[value.display_year, index].join('_')}>
        <p>{value.display_year}<br />
          {data.dataKeys.map(key => (
            <span key={[value.display_year, key].join('_')}>{key}: {getDollarsLong(value[key])}<br /></span>
          ))}
        </p>
      </div>
    ))}
  </div>
);


class BudgetSummaryBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingLongDesc: this.showLongDesc,
      summaryData: props.categoryType === 'use' ? props.summaryUseData : props.summaryDeptData,
    };
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }


  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-9 col-xs-offset-2">
            <h4 className="text-center">Spending {getTitle(this.props.categoryType)}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">

            <BarChartContainer
              data={this.state.summaryData.dataValues}
              colorScheme={this.props.colorScheme}
              mainAxisDataKey="display_year"
              dataKeys={this.state.summaryData.dataKeys}
            />
            {/*
              legendHeight={115}
              referenceArea
              mainReferenceAxisDataKey="yearAxisNumeric"
              referenceAreaLabels={[['Actual', 'Spent'], ['Adopted', 'Budget'], ['Proposed', 'Budget']]}
              referenceAreaExes={[500, 750, 1000]}
              secondaryTickFormatter={getDollars}
              stacked
              toolTipFormatter={getDollarsLong}
              domain={['dataMin', 'dataMax + 50000000']}
              altText={['Spending by', this.props.categoryType, 'bar chart'].join(' ')}
            */}
          </div>
          <span className="pull-right" style={{ fontSize: '12px' }}>Barchart totals exclude interfund transfers</span>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} spending {getTitle(this.props.categoryType)} bar chart summary
            </a>
            <div hidden={!this.state.showingLongDesc}>
              {getLongDesc(this.state.summaryData)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BudgetSummaryBarChart.propTypes = {
  categoryType: PropTypes.string,
  colorScheme: PropTypes.string,
  budgetSummary: PropTypes.object, // eslint-disable-line
  showLongDesc: PropTypes.bool, // eslint-disable-line
};

BudgetSummaryBarChart.defaultProps = {
  categoryType: 'use',
  colorScheme: 'bright_colors',
  showLongDesc: false,
};

//not that efficient...
export default compose(
  graphql(getBudgetSummaryDept, {
    props: ({ data: { budgetSummaryDept } }) => ({
      summaryDeptData: budgetSummaryDept,
    }),
  }),
  graphql(getBudgetSummaryUse, {
    props: ({ data: { budgetSummaryUse } }) => ({
      summaryUseData: budgetSummaryUse,
    }),
  }),
)(BudgetSummaryBarChart);
