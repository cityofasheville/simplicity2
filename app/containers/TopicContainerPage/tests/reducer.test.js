import expect from 'expect';
import topicContainerPageReducer from '../topicContainerPageReducer';

describe('topicContainerPageReducer', () => {
  it('returns the initial state', () => {
    expect(topicContainerPageReducer(undefined, {})).toEqual({});
  });
});
