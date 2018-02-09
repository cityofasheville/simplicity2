import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import BudgetSummaryBarChart from './BudgetSummaryBarChart';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { updateBudgetSummaryUse } from './graphql/budgetMutations';
import { getBudgetSummaryUse } from './graphql/budgetQueries';
import { buildSummaryData } from './budgetUtilities';

class SummaryUse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summaryUseInitialized: false,
    };

    this.initializeSummaryUse = this.initializeSummaryUse.bind(this);
  }

  async initializeSummaryUse() {
    if (this.props.summaryUseData.dataKeys !== null) {
      this.setState({ summaryUseInitialized: true });
      return;
    }
    const summaryUseData = buildSummaryData(this.props.data.budgetSummary);
    await this.props.updateBudgetSummaryUse({
      variables: {
        budgetSummaryUse: {
          dataKeys: summaryUseData.dataKeys,
          dataValues: summaryUseData.dataValues,
        },
      },
    });
    this.setState({ summaryUseInitialized: true });
  }

  render() {
    if (this.props.data.loading) { // eslint-disable-line react/prop-types
      return <LoadingAnimation size="small" />;
    }
    if (this.props.data.error) { // eslint-disable-line react/prop-types
      return <p>{this.props.data.error.message}</p>; // eslint-disable-line react/prop-types
    }

    if (!this.state.summaryUseInitialized) {
      this.initializeSummaryUse();
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <BudgetSummaryBarChart categoryType="use" {...this.props} />
        </div>
      </div>
    );
  }
};

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
