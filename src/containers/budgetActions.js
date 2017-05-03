import { BUILD_TREES, BUILD_SUMMARY_USE_DATA, BUILD_SUMMARY_DEPT_DATA, BUILD_CASH_FLOW_DATA } from './budgetConstants';

export const buildBudgetTrees = queryData => ({
  type: BUILD_TREES,
  queryData,
});

export const buildSummaryUseData = queryData => ({
  type: BUILD_SUMMARY_USE_DATA,
  queryData,
});

export const buildSummaryDeptData = queryData => ({
  type: BUILD_SUMMARY_DEPT_DATA,
  queryData,
});

export const buildCashFlowData = queryData => ({
  type: BUILD_CASH_FLOW_DATA,
  queryData,
});


// export const updateNodePath = rectangle => ({
//   type: UPDATE_NODE_PATH,
//   rectangle,
// });
