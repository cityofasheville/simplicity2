import { getUser, getModalOpen, getDropdownOpen } from './authQueries';

export const authResolvers = {
  Mutation: {
    updateUser: (_, { userInfo }, { cache }) => {
      console.log('in mutation', userInfo);
      cache.writeQuery({ query: getUser, data: userInfo });
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
