/*
 *
 * LanguageProvider reducer
 *
 */

import {
  CHANGE_LOCALE,
} from './languageProviderConstants';

const initialState = {
  locale: 'en',
};

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return Object.assign({}, state, { locale: action.locale });
    default:
      return state;
  }
}

export default languageProviderReducer;
