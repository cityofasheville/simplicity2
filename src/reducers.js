import { combineReducers } from 'redux';

// Import Reducers
import auth from './utilities/auth/authReducers';
import modal from './app/modal/modalReducers';
import search from './app/search/searchReducers';
import budget from './app/budget/budgetReducer';

const reducers = combineReducers({ auth, modal, search, budget });

export default reducers;

