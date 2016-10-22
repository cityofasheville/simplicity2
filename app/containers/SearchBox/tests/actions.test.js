import expect from 'expect';
import {
  defaultAction,
} from '../searchBoxActions';
import {
  DEFAULT_ACTION,
} from '../searchBoxConstants';

describe('SearchBox actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
});
