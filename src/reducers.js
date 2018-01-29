import { combineReducers } from 'redux';

// Import Reducers
import auth from './utilities/auth/authReducers';
import modal from './app/modal/modalReducers';
import budget from './app/budget/budgetReducer';

const reducers = combineReducers({ auth, modal, budget });

export default reducers;

