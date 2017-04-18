import { combineReducers } from 'redux';

// Import Reducers
import auth from './modules/auth/authReducers';
import modal from './containers/modal/modalReducers';
import search from './containers/search/searchReducers';
import searchByEntities from './containers/searchByEntitiesReducer';
import { apollo } from './modules/gql/gqlClient';

const reducers = combineReducers({ auth, modal, search, searchByEntities, apollo });

export default reducers;

