import React from 'react';
import PropTypes from 'prop-types';
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

  props.buildSummaryUseData(props.data.budgetSummary); // eslint-disable-line react/prop-types
  return (
    <div className="row">
      <div className="col-sm-12">
        <BudgetSummaryBarChart categoryType="use" {...props} />
      </div>
    </div>
  );
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

const SummaryUseGQL = graphql(budgetSummaryUseQuery, {})(SummaryUse);
export default connect(
  null,
  dispatch => ({
    buildSummaryUseData: queryData => (
      dispatch(buildSummaryUseData(queryData))
    ),
  }),
)(SummaryUseGQL);
