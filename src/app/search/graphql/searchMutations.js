import gql from 'graphql-tag';

export const updateSearchText = gql`
  mutation updateSearchText($text: String!) {
    updateSearchText(text: $text) @client {
      searchText
    }
  }
`;
