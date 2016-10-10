import expect from 'expect';
import mySimpliCityReducer from '../mySimpliCityPageReducer';

describe('mySimpliCityPageReducer', () => {
  it('returns the initial state', () => {
    expect(mySimpliCityReducer(undefined, {})).toEqual({});
  });
});
