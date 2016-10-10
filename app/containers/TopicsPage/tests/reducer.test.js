import expect from 'expect';
import topicsPageReducer from '../topicsPageReducer';

describe('topicsPageReducer', () => {
  it('returns the initial state', () => {
    expect(topicsPageReducer(undefined, {})).toEqual({});
  });
});
