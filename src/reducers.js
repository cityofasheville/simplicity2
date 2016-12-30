import { combineReducers } from 'redux';

// Import Reducers
import auth from './modules/auth/authReducers';
import modal from './containers/modal/modalReducers';
import { apollo } from './modules/gql/gqlClient';

const reducers = combineReducers({ auth, modal, apollo });

export default reducers;

