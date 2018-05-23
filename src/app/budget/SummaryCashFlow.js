import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import BudgetSankey from './BudgetSankey';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { updateSankeyData } from './graphql/budgetMutations';
import { getSankeyData } from './graphql/budgetQueries';
import { buildCashFlowData } from './budgetUtilities';

class SummaryCashFlow extends React.Component {
  constructor(props) {
    super(props);
    this.initializeSankey = this.initializeSankey.bind(this);
  }

  async initializeSankey() {
    const cashFlowData = buildCashFlowData(this.props.data);
    await this.props.updateSankeyData({
      variables: {
        sankeyData: {
          nodes: cashFlowData.sankeyNodes,
          links: cashFlowData.sankeyLinks,
        },
      },
    });
  }

  render() {
    if (this.props.data.loading) { // eslint-disable-line react/prop-types
      return <LoadingAnimation />;
    }
    if (this.props.data.error) { // eslint-disable-line react/prop-types
      return <Error message={this.props.data.error.message} />; // eslint-disable-line react/prop-types
    }

    if (this.props.sankeyData.nodes === null) {
      this.initializeSankey();
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <h3>Cash flow diagram: Revenues to expenditures</h3>
          <div>
            The chart below shows how revenue flows through the City’s key funds to the various departments. The thickness of each flow is proportional to the amount of money represented. Mouse over the rectangles and flows to see actual amounts.
          </div>
          <BudgetSankey altText="Cash flow diagram" />
        </div>
      </div>
    );
  }
}

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
  graphql(getSankeyData, {
    props: ({ data: { sankeyData } }) => ({
      sankeyData,
    }),
  }),
  graphql(updateSankeyData, { name: 'updateSankeyData' }),
)(SummaryCashFlow);
