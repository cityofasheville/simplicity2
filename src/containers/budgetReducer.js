import { BUILD_TREES, UPDATE_NODE_PATH } from './budgetConstants';
import { buildTrees } from '../modules/utilities/budgetUtilities';

const initialState = {
  expenseTree: {},
  revenueTree: {},
  expensePath: 'root',
  revenuePath: 'root',
};

const budget = (state = initialState, action) => {
  switch (action.type) {
    case BUILD_TREES:
      if (Object.keys(state.expenseTree).length === 0 || Object.keys(state.revenueTree).length === 0) {
        const trees = buildTrees(action.queryData);
        return Object.assign({}, state, { expenseTree: trees.expenseTree }, { revenueTree: trees.revenueTree });
      }
      return state;
    case UPDATE_NODE_PATH:
      if (action.rectangle.account_type === 'E') {
        return Object.assign({}, state, { expensePath: action.rectangle.path });
      }
      return Object.assign({}, state, { revenuePath: action.rectangle.path });
    default:
      return state;
  }
};

export default budget;
