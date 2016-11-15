import expect from 'expect';
import searchResultsPageReducer from '../searchResultsPageReducer';

describe('searchResultsPageReducer', () => {
  it('returns the initial state', () => {
    expect(searchResultsPageReducer(undefined, {})).toEqual({});
  });
});
