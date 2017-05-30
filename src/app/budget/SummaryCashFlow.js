import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import BudgetSankey from './BudgetSankey';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { buildCashFlowData } from './budgetActions';

const SummaryCashFlow = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  props.buildCashFlowData(props.data); // eslint-disable-line react/prop-types

  return (
    <div className="row">
      <div className="col-sm-12">
        <h3>Cash flow diagram: Revenues to expenditures</h3>
        <div style={{ marginBottom: '5px' }}>
          The chart below shows how revenue flows through the City’s key funds to the various departments. The thickness of each flow is proportional to the amount of money represented. Mouse over the rectangles and flows to see actual amounts.
        </div>
        <BudgetSankey altText="Cash flow diagram" />
      </div>
    </div>
  );
};

const glBudgetCashFlowQuery = gql`
  query glBudgetCashFlowQuery {
    glBudgetCashFlowExpenses: budgetCashFlow(accountType: "E") {
        account_type,
        dept_id,
        department_name,
        fund_id,
        fund_name,
        budget,
        year,
    },
    glBudgetCashFlowRevenues: budgetCashFlow(accountType: "R") {
        account_type,
        category_id,
        category_name,
        fund_id,
        fund_name,
        budget,
        year,
    }
  }
`;

const SummaryCashFlowGQL = graphql(glBudgetCashFlowQuery, {})(SummaryCashFlow);

export default connect(
  null,
  dispatch => ({
    buildCashFlowData: queryData => (
      dispatch(buildCashFlowData(queryData))
    ),
  }),
)(SummaryCashFlowGQL);

