import expect from 'expect';
import {
  defaultAction,
} from '../searchResultsPageActions';
import {
  DEFAULT_ACTION,
} from '../searchResultsPageConstants';

describe('SearchResultsPage actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
});
