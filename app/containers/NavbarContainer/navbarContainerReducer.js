/*
 *
 * NavbarContainer reducer
 *
 */

import {
  DEFAULT_ACTION,
} from './navbarContainerConstants';

const initialState = {};

function navbarContainerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default navbarContainerReducer;
