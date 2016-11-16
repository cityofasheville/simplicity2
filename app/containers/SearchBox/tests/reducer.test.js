import expect from 'expect';
import searchBoxReducer from '../searchBoxReducer';

describe('searchBoxReducer', () => {
  it('returns the initial state', () => {
    expect(searchBoxReducer(undefined, {})).toEqual({});
  });
});
