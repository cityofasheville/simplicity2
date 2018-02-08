import gql from 'graphql-tag';

export const updateSankeyData = gql`
  mutation updateSankeyData($sankeyData: sankeyData, ) {
    updateSankeyData(sankeyData: $sankeyData) @client {
      nodes
      links
    }
  }
`;

export const updateBudgetTrees = gql`
  mutation updateBudgetTrees($budgetTrees: budgetTrees) {
    updateBudgetTrees(budgetTrees: $budgetTrees) @client {
      expenseTree
      revenueTree
      expenseTreeForTreemap
      revenueTreeForTreemap
    }
  }
`;

export const updateBudgetSummaryUse = gql`
  mutation updateBudgetSummaryUse($budgetSummaryUse: budgetSummaryUse) {
    updateBudgetSummaryUse(budgetSummaryUse: $budgetSummaryUse) @client {
      dataKeys
      dataValues
    }
  }
`;

export const updateBudgetSummaryDept = gql`
  mutation updateBudgetSummaryDept($budgetSummaryDept: budgetSummaryDept) {
    updateBudgetSummaryDept(budgetSummaryDept: $budgetSummaryDept) @client {
      dataKeys
      dataValues
    }
  }
`;
