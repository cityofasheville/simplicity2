export const defaultBudgetState = {
  sankeyData: {
    __typename: 'sankeyData',
    nodes: null,
    links: null,
  },
  budgetTrees: {
    __typename: 'budgetTrees',
    expenseTree: null,
    revenueTree: null,
    expenseTreeForTreemap: null,
    revenueTreeForTreemap: null,
  },
  budgetSummaryUse: {
    __typename: 'budgetSummaryUse',
    dataKeys: null,
    dataValues: null,
  },
  budgetSummaryDept: {
    __typename: 'budgetSummaryDept',
    dataKeys: null,
    dataValues: null,
  },
};
