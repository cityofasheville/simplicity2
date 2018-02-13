import { getSearchText } from './searchQueries';

export const searchResolvers = {
  Mutation: {
    updateSearchText: (_, { text }, { cache }) => {
      const query = getSearchText;
      const data = {
        searchText: {
          search: text,
        },
      };
      cache.writeQuery({ query, data });
    },
  },
};
