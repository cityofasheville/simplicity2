import { getSearchText } from './searchQueries';

export const searchResolvers = {
  Mutation: {
    updateSearchText: (_, { text }, { cache }) => {
      const query = getSearchText;
      const data = {
        searchText: {
          __typename: 'searchText',
          search: text,
        },
      };
      cache.writeQuery({ query, data });
      return data.searchText;
    },
  },
};
