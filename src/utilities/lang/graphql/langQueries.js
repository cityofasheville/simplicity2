import gql from 'graphql-tag';

export const getLanguage = gql`
  query getLanguage {
    language @client {
      lang
      dropdownOpen
    }
  }
`;
