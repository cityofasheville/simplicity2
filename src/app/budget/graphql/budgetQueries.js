import gql from 'graphql-tag';

export const getSankeyData = gql`
  query getSankeyData {
    sankeyData @client {
      nodes
      links
    }
  }
`;

export const getBudgetTrees = gql`
  query getBudgetTrees {
    budgetTrees @client {
      expenseTree
      revenueTree
      expenseTreeForTreemap
      revenueTreeForTreemap
    }
  }
`;

export const getBudgetSummaryUse = gql`
  query getBudgetSummaryUse {
    budgetSummaryUse @client {
      dataKeys
      dataValues
    }
  }
`;

export const getBudgetSummaryDept = gql`
  query getBudgetSummaryDept {
    budgetSummaryDept @client {
      dataKeys
      dataValues
    }
  }
`;
