import { OPEN_MODAL, CLOSE_MODAL } from './modalActions';

export const openModal = ({ modalType }) => ({
  type: OPEN_MODAL,
  modalType,
  open: true,
});

export const closeModal = () => ({
  type: CLOSE_MODAL,
});
