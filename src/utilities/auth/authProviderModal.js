import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModalClicked } from './authActions';

const AuthProviderModal = (props) => {
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
              <div id="firebaseui-auth-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AuthProviderModal.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    open: state.auth.modal.open,
  };
};

const mapDispatchToProps = dispatch => (
  {
    onClick: () => {
      dispatch(closeModalClicked());
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AuthProviderModal);
