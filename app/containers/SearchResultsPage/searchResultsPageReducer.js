/*
 *
 * SearchResultsPage reducer
 *
 */

import {
  DEFAULT_ACTION,
} from './searchResultsPageConstants';

const initialState = {};

function searchResultsPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default searchResultsPageReducer;
