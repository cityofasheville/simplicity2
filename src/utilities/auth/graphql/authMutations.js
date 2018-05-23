import gql from 'graphql-tag';

export const updateUser = gql`
  mutation updateUser(
    $loggedIn: Boolean
    $privilege: Int
    $name: String
    $email: String
    $provider: String
  ) {
    updateUser(
      loggedIn: $loggedIn
      privilege: $privilege
      name: $name
      email: $email
      provider: $provider
    ) @client {
      loggedIn
      privilege
      name
      email
      provider
    }
  }
`;

export const updateAuthModal = gql`
  mutation updateAuthModal($open: Boolean) {
    updateAuthModal(open: $open) @client {
      modal
    }
  }
`;

export const updateAuthDropdown = gql`
  mutation updateAuthDropdown($open: Boolean) {
    updateAuthDropdown(open: $open) @client {
      dropdown
    }
  }
`;
