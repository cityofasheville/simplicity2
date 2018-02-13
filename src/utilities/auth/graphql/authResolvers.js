import { getUser, getModalOpen, getDropdownOpen } from './authQueries';

export const authResolvers = {
  Mutation: {
    updateUser: (_, { loggedIn, privilege, name, email, provider, token }, { cache }) => {
      const data = {
        user: {
          loggedIn,
          privilege,
          name,
          email,
          provider,
          token,
        },
      };
      cache.writeQuery({ query: getUser, data });
    },
    updateAuthModal: (_, { open }, { cache }) => {
      const data = {
        modal: {
          open,
        },
      };
      cache.writeQuery({ query: getModalOpen, data });
    },
    updateAuthDropdown: (_, { open }, { cache }) => {
      const data = {
        dropdown: {
          open,
        },
      };
      cache.writeQuery({ query: getDropdownOpen, data });
    },
  },
};
