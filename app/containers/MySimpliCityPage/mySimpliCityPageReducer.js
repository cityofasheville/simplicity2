/*
 *
 * MySimpliCity reducer
 *
 */

import {
  DEFAULT_ACTION,
} from './mySimpliCityPageConstants';

const initialState = {};

function mySimpliCityReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default mySimpliCityReducer;
