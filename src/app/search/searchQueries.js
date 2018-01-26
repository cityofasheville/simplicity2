import gql from 'graphql-tag';

export const getSearchText = gql`
  query {
    searchText @client {
      search
    }
  }
`;
