import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import BudgetSankey from './BudgetSankey';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { updateSankeyData } from './graphql/budgetMutations';
import { getSankeyData } from './graphql/budgetQueries';
import { buildCashFlowData } from './budgetUtilities';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

class SummaryCashFlow extends React.Component {
  constructor(props) {
    super(props);
    // set language
    let content;
    switch (props.language.language) {
      case 'Spanish':
        content = spanish;
        break;
      default:
        content = english;
    }
    this.state = {
      content,
    };
    this.initializeSankey = this.initializeSankey.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let content;
    switch (nextProps.language.language) {
      case 'Spanish':
        content = spanish;
        break;
      default:
        content = english;
    }
    this.setState({ content });
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
      return <LoadingAnimation />;
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <h2>{this.state.content.cash_flow_chart_title}</h2>
          <div>
            {this.state.content.cash_flow_chart_intro}
          </div>
          <BudgetSankey altText={this.state.content.cash_flow_diagram} />
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

export default withLanguage(compose(
  graphql(glBudgetCashFlowQuery, {}),
  graphql(getSankeyData, {
    props: ({ data: { sankeyData } }) => ({
      sankeyData,
    }),
  }),
  graphql(updateSankeyData, { name: 'updateSankeyData' }),
)(SummaryCashFlow));
