import expect from 'expect';
import {
  defaultAction,
} from '../mySimpliCityPageActions';
import {
  DEFAULT_ACTION,
} from '../mySimpliCityPageConstants';

describe('MySimpliCity actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
});
