import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import BudgetSummaryBarChart from './BudgetSummaryBarChart';
import LoadingAnimation from '../../shared/LoadingAnimation';

const SummaryDepartments = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation size="small" />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  return (
    <div className="row">
      <div className="col-sm-12">
        <BudgetSummaryBarChart categoryType="department" colorScheme="bright_colors_2" {...props} />
      </div>
    </div>
  );
};

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

export default graphql(budgetSummaryDeptQuery, {})(SummaryDepartments);
