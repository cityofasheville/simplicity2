import expect from 'expect';
import {
  changeLocale,
} from '../languageProviderActions';
import {
  CHANGE_LOCALE,
} from '../languageProviderConstants';

describe('LanguageProvider actions', () => {
  describe('Change Local Action', () => {
    it('has a type of CHANGE_LOCALE', () => {
      const expected = {
        type: CHANGE_LOCALE,
        locale: 'de',
      };
      expect(changeLocale('de')).toEqual(expected);
    });
  });
});
