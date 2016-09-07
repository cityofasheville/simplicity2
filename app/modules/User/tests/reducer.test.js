import expect from 'expect';
import userReducer from '../reducer';

const expected = {
  loggedIn: false,
  privilege: 0,
  name: null,
  email: null,
  provider: null,
  token: null,
  logout: null,
};

describe('userReducer', () => {
  it('returns the initial state', () => {
    expect(userReducer(undefined, {})).toEqual(expected);
  });
});
