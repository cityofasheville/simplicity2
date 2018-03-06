export const defaultAuthState = {
  user: {
    __typename: 'user',
    loggedIn: false,
    privilege: 0,
    name: '',
    email: '',
    provider: '',
  },
  modal: {
    __typename: 'authModal',
    open: false,
  },
  dropdown: {
    __typename: 'authDropdown',
    open: false,
  },
};
