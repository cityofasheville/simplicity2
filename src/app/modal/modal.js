// http://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from './modalActions';

// import AuthModal from './AuthModal';

// const MODAL_COMPONENTS = {
//   AUTH_MODAL: AuthModal,
// };

const Modal = (props) => {
  // if (!modalType) {
  //   return null;
  // }

  // const SpecificModal = MODAL_COMPONENTS[modalType];

  const display = (props.open) ? { display: 'block' } : { display: 'none' };

  return (
    <div className="">
      <div className="modal fade in" style={display} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-label="Close" onClick={props.onClick}><span aria-hidden="true">&times;</span></button>
            </div>
            <div className="modal-body">
              { props.children }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  open: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => (
  {
    open: state.open,
    children: ownProps.children,
  }
);

const mapDispatchToProps = dispatch => (
  {
    onClick: () => {
      dispatch(closeModal());
    },
  }
);




export default connect(mapStateToProps, mapDispatchToProps)(Modal);
