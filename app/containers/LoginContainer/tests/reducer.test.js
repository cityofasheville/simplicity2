import expect from 'expect';
import loginContainerReducer from '../reducer';

describe('loginContainerReducer', () => {
  it('returns the initial state', () => {
    expect(loginContainerReducer(undefined, {})).toEqual({});
  });
});
