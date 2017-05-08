import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import BudgetSummaryBarChart from './BudgetSummaryBarChart';
import LoadingAnimation from '../../../components/LoadingAnimation';
import { buildSummaryDeptData } from '../../../containers/budgetActions';

const SummaryDepartments = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation size="small" />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  props.buildSummaryDeptData(props.data.gl_budget_summary); // eslint-disable-line react/prop-types
  return (
    <div className="row">
      <div className="col-sm-12">
        <BudgetSummaryBarChart categoryType={'department'} colorScheme={1} {...props} />
      </div>
    </div>
  );
};

SummaryDepartments.propTypes = {
  data: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SummaryDepartments.defaultProps = {
  data: {},
};

const glBudgetSummaryDeptQuery = gql`
  query glBudgetSummaryDeptQuery {
    gl_budget_summary(breakdown: "dept", maxCategories: 7) {
        account_type,
        category_name,
        total_budget,
        total_actual,
        year,
    }
  }
`;

const SummaryDepartmentsGQL = graphql(glBudgetSummaryDeptQuery, {})(SummaryDepartments);
export default connect(
  null,
  dispatch => ({
    buildSummaryDeptData: queryData => (
      dispatch(buildSummaryDeptData(queryData))
    ),
  }),
)(SummaryDepartmentsGQL);
