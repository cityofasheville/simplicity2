import { combineReducers } from 'redux';

// Import Reducers
import auth from './auth/authReducers';
import modal from './App/modal/modalReducers';
import search from './App/search/searchReducers';
import searchByEntities from './App/search/searchByEntities/searchByEntitiesReducer';
import budget from './App/budget/budgetReducer';
import { apollo } from './gql/gqlClient';

const reducers = combineReducers({ auth, modal, search, searchByEntities, budget, apollo });

export default reducers;

