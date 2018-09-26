import React from 'react';
import ReactDOM from 'react-dom';


const DataModal = props => ReactDOM.createPortal(
  <aside className="c-modal-cover">
    <div className="c-modal">
      <button
        className="c-modal__close"
        aria-label="Close Modal"
        onClick={() => props.closeModal()}
      >
        <span className="u-hide-visually">Close</span>
        <svg
          className="c-modal__close-icon"
          viewBox="0 0 40 40"
        >
          <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
        </svg>
      </button>
      <div className="c-modal__body">
        This much data: {props.data.length}
      </div>
    </div>
  </aside>,
  document.body
);

export default DataModal;
