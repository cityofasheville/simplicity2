import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import BudgetDetailsTable from './BudgetDetailsTable';
import BudgetDetailsTreemap from './BudgetDetailsTreemap';
import BudgetSummaryDetails from './BudgetSummaryDetails';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { buildTrees } from './budgetUtilities';
import { updateBudgetTrees } from './graphql/budgetMutations';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

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

class BudgetDetailsContainer extends React.Component {
  constructor(props) {
    super(props);
    let content;
    switch (props.language.language) {
      case 'Spanish':
        content = spanish;
        break;
      default:
        content = english;
    }
    this.state = {
      treesInitialized: false,
      content,
    };

    this.initializeTrees = this.initializeTrees.bind(this);
  }

  async initializeTrees() {
    const trees = buildTrees(this.props.data.budgetHistory, this.props.data.budgetParameters);
    await this.props.updateBudgetTrees({
      variables: {
        budgetTrees: {
          expenseTree: trees.expenseTree,
          revenueTree: trees.revenueTree,
          expenseTreeForTreemap: trees.expenseTreeForTreemap,
          revenueTreeForTreemap: trees.revenueTreeForTreemap,
        },
      },
    });
    this.setState({ treesInitialized: true });
  }

  render() {
    if (this.props.data.loading) { // eslint-disable-line react/prop-types
      return (
        <LoadingAnimation message={this.state.content.loading_message} />
      );
    }
    if (this.props.data.error) { // eslint-disable-line react/prop-types
      return <Error message={this.props.data.error.message} />; // eslint-disable-line react/prop-types
    }

    if (!this.state.treesInitialized) {
      this.initializeTrees();
      return (
        <LoadingAnimation message={this.state.content.loading_message} />
      );
    }

    return (
      <div>
        {renderSubComponent(this.props)}
      </div>
    );
  }
}

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
        use_actual
    }
    budgetParameters {
      start_year
      end_year
      in_budget_season
    }
  }
`;

export default withLanguage(compose(
  graphql(budgetHistoryQuery, {}),
  graphql(updateBudgetTrees, { name: 'updateBudgetTrees' }),
)(BudgetDetailsContainer));
