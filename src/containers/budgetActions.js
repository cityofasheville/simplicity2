import { BUILD_TREES, UPDATE_NODE_PATH } from './budgetConstants';

export const buildBudgetTrees = queryData => ({
  type: BUILD_TREES,
  queryData,
});

export const updateNodePath = rectangle => ({
  type: UPDATE_NODE_PATH,
  rectangle,
});
