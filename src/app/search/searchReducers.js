import { SEARCH_KEY_UP } from './searchConstants';


const initialState = {
  text: '',
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_KEY_UP:
      return {
        text: action.text,
      };
    default:
      return state;
  }
};

export default search;
