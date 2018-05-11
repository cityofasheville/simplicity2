import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
// import { connect } from 'react-redux';
import BudgetSummaryBarChart from './BudgetSummaryBarChart';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { updateBudgetSummaryUse } from './graphql/budgetMutations';
import { getBudgetSummaryUse } from './graphql/budgetQueries';
import { buildSummaryData } from './budgetUtilities';

class SummaryUse extends React.Component {
  constructor(props) {
    super(props);
    this.initializeSummaryUse = this.initializeSummaryUse.bind(this);
  }

  async initializeSummaryUse() {
    // if (this.props.summaryUseData.dataKeys !== null) {
    //   return;
    // }
    const summaryUseData = buildSummaryData(this.props.data.budgetSummary, this.props.data.budgetParameters);
    await this.props.updateBudgetSummaryUse({
      variables: {
        budgetSummaryUse: {
          dataKeys: summaryUseData.dataKeys,
          dataValues: summaryUseData.dataValues,
        },
      },
    });
  }

  render() {
    if (this.props.data.loading) { // eslint-disable-line react/prop-types
      return <LoadingAnimation size="small" />;
    }
    if (this.props.data.error) { // eslint-disable-line react/prop-types
      return <Error message={this.props.data.error.message} />; // eslint-disable-line react/prop-types
    }

    if (this.props.summaryUseData.dataKeys === null) {
      this.initializeSummaryUse();
    }

    return (
      <div className="row">
      {console.log(this.props)}
        <div className="col-sm-12">
          <BudgetSummaryBarChart categoryType="use" {...this.props} />
        </div>
      </div>
    );
  }
}

SummaryUse.propTypes = {
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SummaryUse.defaultProps = {
  data: {},
};

const budgetSummaryUseQuery = gql`
  query budgetSummaryUseQuery {
    budgetSummary(breakdown: "use", maxCategories: 5) {
        account_type,
        category_name,
        total_budget,
        total_actual,
        year,
    }
    budgetParameters {
      start_year
      end_year
      in_budget_season
    }
  }
`;

export default compose(
  graphql(budgetSummaryUseQuery, {}),
  graphql(getBudgetSummaryUse, {
    props: ({ data: { budgetSummaryUse } }) => ({
      summaryUseData: budgetSummaryUse,
    }),
  }),
  graphql(updateBudgetSummaryUse, { name: 'updateBudgetSummaryUse' }),
)(SummaryUse);
