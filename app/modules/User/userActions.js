/*
 *
 * User actions
 *
 */

import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
} from './userConstants';

export function userLoggedIn(user) {
  let privilege = 1;
  if (user.provider === 'google.com') {
    if (user.email.endsWith('ashevillenc.gov')) {
      privilege = 2;
    }
  }
  const rval = {
    type: USER_LOGGED_IN,
    data: {
      email: user.email,
      name: user.name,
      provider: user.provider,
      token: user.token,
      logout: user.logout,
      privilege,
    },
  };
  return rval;
}

export function userLoggedOut() {
  return { type: USER_LOGGED_OUT };
}
