import React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import BudgetDetailsTable from './BudgetDetailsTable';
import BudgetDetailsTreemap from './BudgetDetailsTreemap';
import BudgetSummaryDetails from './BudgetSummaryDetails';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { buildBudgetTrees } from './budgetActions';

const renderSubComponent = (props) => {
  switch (props.location.pathname) { // eslint-disable-line react/prop-types
    case '/budget/detailsTreemap':
      return (<BudgetDetailsTreemap {...props} />);
    case '/budget/detailsTable':
      return (<BudgetDetailsTable {...props} />);
    default:
      return (<BudgetSummaryDetails {...props} />);
  }
};

const BudgetDetailsContainer = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return (
      <LoadingAnimation message="Loading...Thank you for your patience. The full budget data can take several moments to load"/>
    );
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  props.buildBudgetTrees(props.data.budgetHistory); // eslint-disable-line react/prop-types
  return (
    <div>
      {renderSubComponent(props)}
    </div>
  );
};

const budgetHistoryQuery = gql`
  query budgetHistoryQuery {
    budgetHistory {
        account_type,
        func_id,
        dept_id,
        div_id,
        obj_id,
        function_name,
        department_name,
        division_name,
        year,
        actual,
        budget,
        account_name,
        category_name,
        category_id,
        budget_section_name,
        budget_section_id
    }
  }
`;

const BudgetDetailsContainerGQL = graphql(budgetHistoryQuery, {})(BudgetDetailsContainer);
export default connect(
  null,
  dispatch => ({
    buildBudgetTrees: queryData => (
      dispatch(buildBudgetTrees(queryData))
    ),
  }),
)(BudgetDetailsContainerGQL);
