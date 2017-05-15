import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import BudgetSummaryBarChart from './BudgetSummaryBarChart';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { buildSummaryUseData } from './budgetActions';

const SummaryUse = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation size="small" />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  props.buildSummaryUseData(props.data.gl_budget_summary); // eslint-disable-line react/prop-types
  return (
    <div className="row">
      <div className="col-sm-12">
        <BudgetSummaryBarChart categoryType={'use'} {...props} />
      </div>
    </div>
  );
};

SummaryUse.propTypes = {
  data: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SummaryUse.defaultProps = {
  data: {},
};

const glBudgetSummaryUseQuery = gql`
  query glBudgetSummaryUseQuery {
    gl_budget_summary(breakdown: "use", maxCategories: 5) {
        account_type,
        category_name,
        total_budget,
        total_actual,
        year,
    }
  }
`;

const SummaryUseGQL = graphql(glBudgetSummaryUseQuery, {})(SummaryUse);
export default connect(
  null,
  dispatch => ({
    buildSummaryUseData: queryData => (
      dispatch(buildSummaryUseData(queryData))
    ),
  }),
)(SummaryUseGQL);
