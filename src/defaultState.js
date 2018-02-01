import { defaultSearchState } from './app/search/graphql/searchDefaultState';
import { defaultAuthState } from './utilities/auth/graphql/authDefaultState';

export const defaultState = Object.assign({}, defaultSearchState, defaultAuthState);
