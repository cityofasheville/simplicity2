/*
 *
 * SearchBox reducer
 *
 */

import {
  DEFAULT_ACTION,
} from './searchBoxConstants';

const initialState = {};

function searchBoxReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default searchBoxReducer;
