import { BUILD_TREES, BUILD_SUMMARY_USE_DATA, BUILD_SUMMARY_DEPT_DATA, BUILD_CASH_FLOW_DATA } from './budgetConstants';
import { buildTrees, buildSummaryData, buildCashFlowData } from './budgetUtilities';
const objectAssign = require('object-assign');

const initialState = {
  expenseTree: {},
  revenueTree: {},
  expenseTreeForTreemap: {},
  revenueTreeForTreemap: {},
  summaryUseData: {},
  summaryDeptData: {},
  cashFlowData: {},
  // expensePath: 'root',
  // revenuePath: 'root',
};

const budget = (state = initialState, action) => {
  switch (action.type) {
    case BUILD_TREES: {
      if (Object.keys(state.expenseTree).length === 0 || Object.keys(state.revenueTree).length === 0) {
        const trees = buildTrees(action.queryData);
        return objectAssign({}, state, { expenseTree: trees.expenseTree }, { revenueTree: trees.revenueTree }, { expenseTreeForTreemap: trees.expenseTreeForTreemap }, { revenueTreeForTreemap: trees.revenueTreeForTreemap });
      }
      return state;
    }
    case BUILD_SUMMARY_USE_DATA: {
      if (Object.keys(state.summaryUseData).length === 0) {
        const newSummaryUseData = buildSummaryData(action.queryData);
        return objectAssign({}, state, { summaryUseData: newSummaryUseData });
      }
      return state;
    }
    case BUILD_SUMMARY_DEPT_DATA: {
      if (Object.keys(state.summaryDeptData).length === 0) {
        const newSummaryDeptData = buildSummaryData(action.queryData);
        return objectAssign({}, state, { summaryDeptData: newSummaryDeptData });
      }
      return state;
    }
    case BUILD_CASH_FLOW_DATA: {
      if (Object.keys(state.cashFlowData).length === 0) {
        const newCashFlowData = buildCashFlowData(action.queryData);
        return objectAssign({}, state, { cashFlowData: { nodes: newCashFlowData.sankeyNodes, links: newCashFlowData.sankeyLinks } });
      }
      return state;
    }
    // case UPDATE_NODE_PATH:
    //   if (action.rectangle.account_type === 'E') {
    //     return objectAssign({}, state, { expensePath: action.rectangle.path });
    //   }
    //   return objectAssign({}, state, { revenuePath: action.rectangle.path });
    default:
      return state;
  }
};

export default budget;
