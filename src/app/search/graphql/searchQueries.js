import gql from 'graphql-tag';

export const getSearchText = gql`
  query getSearchText {
    searchText @client {
      search
    }
  }
`;
