import gql from 'graphql-tag';

export const updateLanguage = gql`
  mutation updateLanguage($lang: String, $dropdownOpen: Boolean) {
    updateLanguage(lang: $lang, dropdownOpen: $dropdownOpen) @client {
      lang
      dropdownOpen
    }
  }
`;
