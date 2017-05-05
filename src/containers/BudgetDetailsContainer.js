import React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import BudgetDetailsTable from '../topics/budget/summary/BudgetDetailsTable';
import BudgetDetailsTreemap from '../topics/budget/summary/BudgetDetailsTreemap';
import BudgetSummaryDetails from '../topics/budget/summary/BudgetSummaryDetails';
import { buildBudgetTrees } from './budgetActions';

const renderSubComponent = (props) => {
  switch (props.location.pathname) { // eslint-disable-line react/prop-types
    case '/topics/budget/detailsTreemap':
      return (<BudgetDetailsTreemap {...props} />);
    case '/topics/budget/detailsTable':
      return (<BudgetDetailsTable {...props} />);
    default:
      return (<BudgetSummaryDetails {...props} />);
  }
};

const BudgetDetailsContainer = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <p>Loading...</p>;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  props.buildBudgetTrees(props.data.gl_budget_history_plus_proposed); // eslint-disable-line react/prop-types
  return (
    <div>
      {renderSubComponent(props)}
    </div>
  );
};

const glBudgetHistoryPlusProposedQuery = gql`
  query glBudgetHistoryPlusPropsedQuery {
    gl_budget_history_plus_proposed {
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

const BudgetDetailsContainerGQL = graphql(glBudgetHistoryPlusProposedQuery, {})(BudgetDetailsContainer);
export default connect(
  null,
  dispatch => ({
    buildBudgetTrees: queryData => (
      dispatch(buildBudgetTrees(queryData))
    ),
  }),
)(BudgetDetailsContainerGQL);
