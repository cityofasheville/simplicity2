import { getSankeyData, getBudgetTrees, getBudgetSummaryDept, getBudgetSummaryUse } from './budgetQueries';

export const budgetResolvers = {
  Mutation: {
    updateSankeyData: (_, { sankeyData }, { cache }) => {
      const query = getSankeyData;
      const data = {
        sankeyData: {
          nodes: sankeyData.nodes,
          links: sankeyData.links,
        },
      };
      cache.writeQuery({ query, data });
    },
    updateBudgetTrees: (_, { budgetTrees }, { cache }) => {
      const query = getBudgetTrees;
      const data = {
        budgetTrees: {
          expenseTree: budgetTrees.expenseTree,
          revenueTree: budgetTrees.revenueTree,
          expenseTreeForTreemap: budgetTrees.expenseTreeForTreemap,
          revenueTreeForTreemap: budgetTrees.revenueTreeForTreemap,
        },
      };
      cache.writeQuery({ query, data });
    },
    updateBudgetSummaryUse: (_, { budgetSummaryUse }, { cache }) => {
      const query = getBudgetSummaryUse;
      const data = {
        budgetSummaryUse: {
          dataValues: budgetSummaryUse.dataValues,
          dataKeys: budgetSummaryUse.dataKeys,
        },
      };
      cache.writeQuery({ query, data });
    },
    updateBudgetSummaryDept: (_, { budgetSummaryDept }, { cache }) => {
      const query = getBudgetSummaryDept;
      const data = {
        budgetSummaryDept: {
          dataValues: budgetSummaryDept.dataValues,
          dataKeys: budgetSummaryDept.dataKeys,
        },
      };
      cache.writeQuery({ query, data });
    },
  },
};
