import { BUILD_TREES, BUILD_SUMMARY_USE_DATA, BUILD_SUMMARY_DEPT_DATA } from './budgetConstants';
import { buildTrees, buildSummaryData } from '../modules/utilities/budgetUtilities';

const initialState = {
  expenseTree: {},
  revenueTree: {},
  expenseTreeForTreemap: {},
  revenueTreeForTreemap: {},
  summaryUseData: {},
  summaryDeptData: {},
  // expensePath: 'root',
  // revenuePath: 'root',
};

const budget = (state = initialState, action) => {
  switch (action.type) {
    case BUILD_TREES: {
      if (Object.keys(state.expenseTree).length === 0 || Object.keys(state.revenueTree).length === 0) {
        const trees = buildTrees(action.queryData);
        return Object.assign({}, state, { expenseTree: trees.expenseTree }, { revenueTree: trees.revenueTree }, { expenseTreeForTreemap: trees.expenseTreeForTreemap }, { revenueTreeForTreemap: trees.revenueTreeForTreemap });
      }
      return state;
    }
    case BUILD_SUMMARY_USE_DATA: {
      if (Object.keys(state.summaryUseData).length === 0) {
        const newSummaryUseData = buildSummaryData(action.queryData);
        return Object.assign({}, state, { summaryUseData: newSummaryUseData });
      }
      return state;
    }
    case BUILD_SUMMARY_DEPT_DATA: {
      if (Object.keys(state.summaryDeptData).length === 0) {
        const newSummaryDeptData = buildSummaryData(action.queryData);
        return Object.assign({}, state, { summaryDeptData: newSummaryDeptData });
      }
      return state;
    }
    // case UPDATE_NODE_PATH:
    //   if (action.rectangle.account_type === 'E') {
    //     return Object.assign({}, state, { expensePath: action.rectangle.path });
    //   }
    //   return Object.assign({}, state, { revenuePath: action.rectangle.path });
    default:
      return state;
  }
};

export default budget;
