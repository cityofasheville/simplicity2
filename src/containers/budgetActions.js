import { BUILD_TREES } from './budgetConstants';

export const buildBudgetTrees = queryData => ({
  type: BUILD_TREES,
  queryData,
});

// export const updateNodePath = rectangle => ({
//   type: UPDATE_NODE_PATH,
//   rectangle,
// });
