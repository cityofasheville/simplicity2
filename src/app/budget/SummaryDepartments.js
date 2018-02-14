import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import BudgetSummaryBarChart from './BudgetSummaryBarChart';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { buildSummaryData } from './budgetUtilities';
import { updateBudgetSummaryDept } from './graphql/budgetMutations';
import { getBudgetSummaryDept } from './graphql/budgetQueries';

class SummaryDepartments extends React.Component {
  constructor(props) {
    super(props);
    this.initializeSummaryDept = this.initializeSummaryDept.bind(this);
  }

  async initializeSummaryDept() {
    const summaryDeptData = buildSummaryData(this.props.data.budgetSummary);
    await this.props.updateBudgetSummaryDept({
      variables: {
        budgetSummaryDept: {
          dataValues: summaryDeptData.dataValues,
          dataKeys: summaryDeptData.dataKeys,
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

    if (this.props.summaryDeptData.dataKeys === null) {
      this.initializeSummaryDept();
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <BudgetSummaryBarChart categoryType="department" colorScheme="bright_colors_2" {...this.props} />
        </div>
      </div>
    );
  }
}

SummaryDepartments.propTypes = {
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SummaryDepartments.defaultProps = {
  data: {},
};

const budgetSummaryDeptQuery = gql`
  query budgetSummaryDeptQuery {
    budgetSummary(breakdown: "dept", maxCategories: 7) {
        account_type,
        category_name,
        total_budget,
        total_actual,
        year,
    }
  }
`;

export default compose(
  graphql(budgetSummaryDeptQuery, {}),
  graphql(getBudgetSummaryDept, {
    props: ({ data: { budgetSummaryDept } }) => ({
      summaryDeptData: budgetSummaryDept,
    }),
  }),
  graphql(updateBudgetSummaryDept, { name: 'updateBudgetSummaryDept' }),
)(SummaryDepartments);
