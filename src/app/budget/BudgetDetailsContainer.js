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
    this.state = {
      treesInitialized: false,
    };

    this.initializeTrees = this.initializeTrees.bind(this);
  }

  async initializeTrees() {
    const trees = buildTrees(this.props.data.budgetHistory);
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
        <LoadingAnimation message="Loading...Thank you for your patience. The full budget data can take several moments to load" />
      );
    }
    if (this.props.data.error) { // eslint-disable-line react/prop-types
      return <Error message={this.props.data.error.message} />; // eslint-disable-line react/prop-types
    }

    if (!this.state.treesInitialized) {
      this.initializeTrees();
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
    }
  }
`;

export default compose(
  graphql(budgetHistoryQuery, {}),
  graphql(updateBudgetTrees, { name: 'updateBudgetTrees' }),
)(BudgetDetailsContainer);
