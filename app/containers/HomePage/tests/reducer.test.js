import expect from 'expect';
import homeReducer from '../homePageReducer';
import {
  changeUsername,
} from '../homePageActions';

describe('homeReducer', () => {
  let state;
  beforeEach(() => {
    state = {
      username: '',
    };
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(homeReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the changeUsername action correctly', () => {
    const fixture = 'mxstbr';
    const expectedResult = Object.assign({}, state, { username: fixture });

    expect(homeReducer(state, changeUsername(fixture))).toEqual(expectedResult);
  });
});
