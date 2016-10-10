/*
 *
 * TopicContainerPage reducer
 *
 */

import {
  DEFAULT_ACTION,
} from './topicContainerPageConstants';

const initialState = {};

function topicContainerPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default topicContainerPageReducer;
