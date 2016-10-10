import expect from 'expect';
import {
  defaultAction,
} from '../topicContainerPageActions';
import {
  DEFAULT_ACTION,
} from '../topicContainerPageConstants';

describe('TopicContainerPage actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
});
