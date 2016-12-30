import { combineReducers } from 'redux';
import { USER_LOGGED_IN, USER_LOGGED_OUT, LOGIN_LINK_CLICKED, CLOSE_MODAL_CLICKED, AUTH_CONTROL_DROPDOWN_CLICKED } from './authConstants';

const initialUserState = {
  loggedIn: false,
  privilege: 0,
};

const user = (state = initialUserState, action) => {
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
};

const initialModalState = { open: false };

const modal = (state = initialModalState, action) => {
  switch (action.type) {
    case LOGIN_LINK_CLICKED:
      {
        return Object.assign({}, state, {
          open: true,
        });
      }
    case CLOSE_MODAL_CLICKED:
      return Object.assign({}, state, {
        open: false,
      });
    default:
      return state;
  }
};

const initialDropdownState = { open: false };

const dropdown = (state = initialDropdownState, action) => {
  switch (action.type) {
    case AUTH_CONTROL_DROPDOWN_CLICKED:
      {
        return Object.assign({}, state, {
          open: !state.open,
        });
      }
    default:
      return state;
  }
};


const auth = combineReducers({ user, modal, dropdown });

export default auth;
