import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import BudgetSankey from './BudgetSankey';
import { buildCashFlowData } from '../../../containers/budgetActions';

const SummaryCashFlow = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <p>Loading...</p>;
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
          Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart.
        </div>
        <BudgetSankey />
      </div>
    </div>
  );
};

const nameShape = {
  name: React.PropTypes.string,
};

const linkShape = {
  source: React.PropTypes.number,
  target: React.PropTypes.number,
  value: React.PropTypes.number,
};

SummaryCashFlow.propTypes = {
  nodes: React.PropTypes.arrayOf(React.PropTypes.shape(nameShape)),
  links: React.PropTypes.arrayOf(React.PropTypes.shape(linkShape)),
};

const glBudgetCashFlowQuery = gql`
  query glBudgetCashFlowQuery {
    glBudgetCashFlowExpenses: gl_budget_cash_flow(accountType: "E") {
        account_type,
        dept_id,
        department_name,
        fund_id,
        fund_name,
        budget,
        year,
    },
    glBudgetCashFlowRevenues: gl_budget_cash_flow(accountType: "R") {
        account_type,
        charcode,
        charcode_name,
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

