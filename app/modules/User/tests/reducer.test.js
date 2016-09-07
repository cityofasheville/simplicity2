import expect from 'expect';
import userReducer from '../reducer';

describe('userReducer', () => {
  it('returns the initial state', () => {
    expect(userReducer(undefined, {})).toEqual({});
  });
});
