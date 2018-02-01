import { combineReducers } from 'redux';

// Import Reducers
import modal from './app/modal/modalReducers';
import budget from './app/budget/budgetReducer';

const reducers = combineReducers({ modal, budget });

export default reducers;

