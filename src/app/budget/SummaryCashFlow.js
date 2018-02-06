import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import BudgetSankey from './BudgetSankey';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { updateSankeyData } from './graphql/budgetMutations';
import { buildCashFlowData } from './budgetUtilities';

const SummaryCashFlow = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  const cashFlowData = buildCashFlowData(props.data);

  props.updateSankeyData({
    variables: {
      sankeyData: {
        nodes: cashFlowData.sankeyNodes,
        links: cashFlowData.sankeyLinks,
      },
    },
  });

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

export default compose(
  graphql(glBudgetCashFlowQuery, {}),
  graphql(updateSankeyData, { name: 'updateSankeyData' }),
)(SummaryCashFlow);
