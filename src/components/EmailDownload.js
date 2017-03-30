import React from 'react';

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
  emailFunction: React.PropTypes.func,
  downloadFunction: React.PropTypes.func,
  args: React.PropTypes.object,  // eslint-disable-line react/forbid-prop-types
};

export default EmailDownload;
