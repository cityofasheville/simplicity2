import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import BudgetDetailsTable from '../topics/budget/summary/BudgetDetailsTable'
import BudgetDetailsTreemap from '../topics/budget/summary/BudgetDetailsTreemap'
import BudgetSummaryDetails from '../topics/budget/summary/BudgetSummaryDetails'
import { buildTrees } from '../modules/utilities/budgetUtilities';

const renderSubComponent = (props) => {
  switch (props.location.pathName) {
    case '/topics/budget/detailsTreemap':
      return (<BudgetDetailsTreemap {...props} />);
    case '/topics/budget/detailsTable':
      return (<BudgetDetailsTable {...props} />)
    default:
      return (<BudgetSummaryDetails {...props} />);
  }
};

const BudgetDetailsContainer = (props) => {
  if (props.data.loading) {
    return <p>Loading...</p>;
  }
  if (props.data.error) {
    return <p>{props.data.error.message}</p>;
  }

  buildTrees(props.data.gl_budget_history_plus_proposed);
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
        fund_id,
        func_id,
        dept_id,
        div_id,
        cost_id,
        obj_id,
        org_id,
        proj_id,
        function_name,
        department_name,
        division_name,
        object_name,
        organization_name,
        year,
        actual,
        budget,
        fund_name,
        costcenter_name,
        is_proposed,
        full_account_id,
        account_name,
    }
  }
`;

export default graphql(glBudgetHistoryPlusProposedQuery, {})(BudgetDetailsContainer);
