import { getUser, getModalOpen, getDropdownOpen } from './authQueries';

export const authResolvers = {
  Mutation: {
    updateUser: (_, { loggedIn, privilege, name, email, provider }, { cache }) => {
      const data = {
        user: {
          __typename: 'user',
          loggedIn,
          privilege,
          name,
          email,
          provider,
        },
      };
      cache.writeQuery({ query: getUser, data });
      return data.user;
    },
    updateAuthModal: (_, { open }, { cache }) => {
      const data = {
        modal: {
          __typename: 'authModal',
          open,
        },
      };
      cache.writeQuery({ query: getModalOpen, data });
      return data.modal;
    },
    updateAuthDropdown: (_, { open }, { cache }) => {
      const data = {
        dropdown: {
          __typename: 'authDropdown',
          open,
        },
      };
      cache.writeQuery({ query: getDropdownOpen, data });
      return data.dropdown;
    },
  },
};
