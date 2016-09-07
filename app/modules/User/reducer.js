/*
 *
 * User reducer
 *
 */

import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
} from './constants';

const initialState = {
  loggedIn: false,
  privilege: 0,
  name: null,
  email: null,
  provider: null,
  token: null,
  logout: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      {
        return Object.assign({}, state, {
          loggedIn: true,
          privilege: action.data.privilege,
          name: action.data.name,
          email: action.data.email,
          provider: action.data.provider,
          token: action.data.token,
          logout: action.data.logout,
        });
      }

    case USER_LOGGED_OUT:
      {
        return Object.assign({}, state, {
          loggedIn: false,
          privilege: 0,
        });
      }

    default:
      return state;
  }
}

export default userReducer;
