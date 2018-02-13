import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { getModalOpen } from './graphql/authQueries';
import { updateAuthModal } from './graphql/authMutations';

const AuthProviderModal = (props) => {
  const display = (props.open) ? { display: 'block' } : { display: 'none' };

  return (
    <div className="">
      <div className="modal fade in" style={display} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => props.updateAuthModal({
                  variables: {
                    open: !props.open,
                  },
                })}
              >
                <span aria-hidden="true">&times;</span>
              </button>
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
  open: PropTypes.bool,
  updateAuthModal: PropTypes.func,
};

export default compose(
  graphql(updateAuthModal, { name: 'updateAuthModal' }),
  graphql(getModalOpen, {
    props: ({ data: { modal } }) => ({
      open: modal.open,
    }),
  })
)(AuthProviderModal);
