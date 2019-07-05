import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import BarChart from '../../shared/visualization/BarChart';
import { formatBudgetDataForStackedBar } from '../../shared/visualization/visUtilities';
import { createAnnotations } from './budgetUtilities';
import { getBudgetSummaryDept, getBudgetSummaryUse } from './graphql/budgetQueries';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' :
      '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' :
      '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
};

const getDollarsLong = (value) => {
  if (!value || value === 0) { return '$0'; }
  return [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('');
};

class BudgetSummaryBarChart extends React.Component {
  constructor(props) {
    super(props);
    // set language
    let content;
    switch (props.language.language) {
      case 'Spanish':
        content = spanish;
        break;
      default:
        content = english;
    }

    this.state = {
      showingLongDesc: this.showLongDesc,
      summaryData: props.categoryType === 'use' ? props.summaryUseData : props.summaryDeptData,
      content,
    };
  }

  componentWillReceiveProps(nextProps) {
    let content;
    switch (nextProps.language.language) {
      case 'Spanish':
        content = spanish;
        break;
      default:
        content = english;
    }
    this.setState({ content });
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }

  getTitle() {
    switch (this.props.categoryType) {
      case 'use':
        return this.state.content.spending_by_use;
      case 'department':
        return this.state.content.spending_by_department;
      default:
        return '';
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="visualization no-padding">
            <BarChart
              annotations={createAnnotations(this.props.data.budgetParameters)}
              data={this.state.summaryData.dataValues}
              colorScheme={this.props.colorScheme}
              mainAxisDataKey="display_year"
              dataKeys={this.state.summaryData.dataKeys}
              yAxisTickFormatter={getDollars}
              tooltipYValFormatter={getDollarsLong}
              domain={[0, 200000000]}
              legendLabelFormatter={function(label) {return label.replace(' Department', '')}}
              altText={`${this.getTitle()} ${this.state.content.bar_chart}`}
              chartTitle={this.props.categoryType === 'use' ? this.state.content.spending_by_use : this.state.content.spending_by_department}
              dataFormatter={formatBudgetDataForStackedBar}
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

// not that efficient...
export default withLanguage(compose(
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
)(BudgetSummaryBarChart));
