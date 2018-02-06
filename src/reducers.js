import { combineReducers } from 'redux';

// Import Reducers
import budget from './app/budget/budgetReducer';

const reducers = combineReducers({ budget });

export default reducers;

