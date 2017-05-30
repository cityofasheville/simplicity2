import React from 'react';
import PropTypes from 'prop-types';

const EmailDownload = props => (
  <div style={{ marginTop: '5px' }}>
    <button className="btn btn-success" style={{ marginRight: '5px' }} onClick={props.downloadFunction !== undefined ? () => props.downloadFunction(props.args) : null}>
      <i className="fa fa-download"></i> Download
    </button>
    <button className="btn btn-success" onClick={props.emailFunction !== undefined ? () => props.emailFunction(props.args) : null}>
      <i className="fa fa-envelope"></i> Email
    </button>
  </div>
);

EmailDownload.propTypes = {
  emailFunction: PropTypes.func,
  downloadFunction: PropTypes.func,
  args: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
};

export default EmailDownload;
