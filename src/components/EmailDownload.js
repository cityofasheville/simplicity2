import React from 'react';

const EmailDownload = () => (
  <div>
    <a className="pull-right text-center hidden-xs" style={{ padding: '10px' }}>
      <i className="fa fa-download"></i><br />Download
    </a>
    <a className="pull-right text-center hidden-xs" style={{ padding: '10px' }}>
      <i className="fa fa-envelope-o"></i><br />Email
    </a>
    <a className="pull-right text-center visible-xs" style={{ padding: '10px', fontSize: '10px' }}>
      <i className="fa fa-download"></i><br />Download
    </a>
    <a className="pull-right text-center visible-xs" style={{ padding: '10px', fontSize: '10px' }}>
      <i className="fa fa-envelope-o"></i><br />Email
    </a>
  </div>
);

export default EmailDownload;
