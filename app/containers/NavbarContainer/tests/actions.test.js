import expect from 'expect';
import {
  defaultAction,
} from '../navbarContainerActions';
import {
  DEFAULT_ACTION,
} from '../navbarContainerConstants';

describe('NavbarContainer actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
});
