import expect from 'expect';
import {
  defaultAction,
} from '../topicsPageActions';
import {
  DEFAULT_ACTION,
} from '../topicsPageConstants';

describe('Topics actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
});
