import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import BarChart from '../../shared/visualization/BarChart';
import { createAnnotations } from './budgetUtilities';
import { getBudgetSummaryDept, getBudgetSummaryUse } from './graphql/budgetQueries';

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
};

const getDollarsLong = value => {
  if (!value || value === 0) {return '$0'}
  return [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
}

const getTitle = (categoryType) => {
  switch (categoryType) {
    case 'use':
      return 'Spending By Use';
    case 'department':
      return 'Spending By Department';
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
          <div className="col-sm-12">
            <BarChart
              annotations={createAnnotations(this.props.data.budgetParameters)}
              data={this.state.summaryData.dataValues}
              colorScheme={this.props.colorScheme}
              mainAxisDataKey="display_year"
              dataKeys={this.state.summaryData.dataKeys}
              yAxisTickFormatter={getDollars}
              tooltipYValFormatter={getDollarsLong}
              domain={[0, 190000000]}
              legendLabelFormatter={function(label) {return label.replace(' Department', '')}}
              altText={['Spending by', this.props.categoryType, 'bar chart'].join(' ')}
              chartTitle={getTitle(this.props.categoryType)}
            />
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
