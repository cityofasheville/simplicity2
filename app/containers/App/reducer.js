/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
} from './constants';

// The initial state of the App
const initialState = {
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_REPOS:
      {
        const userData = { repositories: false };
        return Object.assign({}, state, {
          loading: true,
          error: false,
          userData,
        });
      }
    case LOAD_REPOS_SUCCESS:
      {
        const userData = { repositories: action.repos };
        return Object.assign({}, state, {
          loading: false,
          currentUser: action.username,
          userData,
        });
      }
    case LOAD_REPOS_ERROR:
      {
        return Object.assign({}, state, {
          loading: false,
          error: action.error,
        });
      }
    default:
      return state;
  }
}

export default appReducer;
