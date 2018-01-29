import gql from 'graphql-tag';

export const getSearchText = gql`
  query {
    searchText @client {
      search
    }
  }
`;

export const updateSearchText = gql`
  mutation updateSearchText($text: String!) {
    updateSearchText(text: $text) @client {
      searchText
    }
  }
`;
