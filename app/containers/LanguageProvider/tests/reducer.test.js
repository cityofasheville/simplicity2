import expect from 'expect';
import languageProviderReducer from '../languageProviderReducer';

describe('languageProviderReducer', () => {
  it('returns the initial state', () => {
    expect(languageProviderReducer(undefined, {})).toEqual({
      locale: 'en',
    });
  });
});
