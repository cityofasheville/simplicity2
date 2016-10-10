/*
 *
 * Topics reducer
 *
 */

import {
  DEFAULT_ACTION,
} from './topicsPageConstants';

const initialState = {};

function topicsPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default topicsPageReducer;
