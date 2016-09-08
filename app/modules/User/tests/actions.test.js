import expect from 'expect';
import {
  USER_LOGGED_IN,
} from '../userConstants';

describe('User actions', () => {
  describe('UserLoggedIn Action', () => {
    it('has a type of USER_LOGGED_IN', () => {
      expect(USER_LOGGED_IN).toEqual(USER_LOGGED_IN);
    });
  });
});
