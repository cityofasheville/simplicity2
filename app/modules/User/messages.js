/*
 * User Messages
 *
 * This contains all the text for the User component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  logoutError: {
    id: 'app.containers.User.logoutError',
    defaultMessage: 'There was an error logging out.',
  },
  testError: {
    id: 'app.containers.User.testError',
    defaultMessage: 'This is just a test error to say hi!',
  },
});
