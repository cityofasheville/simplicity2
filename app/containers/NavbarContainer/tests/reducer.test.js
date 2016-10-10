import expect from 'expect';
import navbarContainerReducer from '../navbarContainerReducer';

describe('navbarContainerReducer', () => {
  it('returns the initial state', () => {
    expect(navbarContainerReducer(undefined, {})).toEqual({});
  });
});
