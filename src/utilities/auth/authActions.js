import { USER_LOGGED_IN, USER_LOGGED_OUT, LOGIN_LINK_CLICKED, CLOSE_MODAL_CLICKED, LOGOUT_LINK_CLICKED, LOGIN_ERROR, LOGOUT_ERROR, AUTH_CONTROL_DROPDOWN_CLICKED } from './authConstants';


export const authControlDropdownClicked = () => (
  {
    type: AUTH_CONTROL_DROPDOWN_CLICKED,
  }
);

export const loginLinkClicked = () => (
  {
    type: LOGIN_LINK_CLICKED,
  }
);

export const closeModalClicked = () => ({
  type: CLOSE_MODAL_CLICKED,
});

// Expects the logout function from the user object to be passed in
export const logoutLinkClicked = logout => (
  {
    type: LOGOUT_LINK_CLICKED,
    logout,
  }
);

export const userLoggedIn = (user) => {
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
};


export const userLoggedOut = () => (
  { type: USER_LOGGED_OUT }
);

export const loginError = error => ({
  type: LOGIN_ERROR,
  data: {
    message: 'There was an error logging the user in.',
    error,
  },
});

export const logoutError = error => ({
  type: LOGOUT_ERROR,
  data: {
    message: 'There was an error logging user out.',
    error,
  },
});