import { OPEN_MODAL, CLOSE_MODAL } from './modalActions';

const initialState = {
  modalType: null,
  open: false,
};

const modal = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        modalType: action.modalType,
        open: action.open,
      };
    case CLOSE_MODAL:
      return initialState;
    default:
      return state;
  }
};

export default modal;
