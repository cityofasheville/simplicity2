/*
 *
 * LanguageProvider actions
 *
 */

import {
  CHANGE_LOCALE,
} from './languageProviderConstants';

export function changeLocale(languageLocale) {
  return {
    type: CHANGE_LOCALE,
    locale: languageLocale,
  };
}
