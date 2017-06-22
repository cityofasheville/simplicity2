import React from 'react';
import PropTypes from 'prop-types';
import FaDownload from 'react-icons/lib/fa/download';
import FaEnvelope from 'react-icons/lib/fa/envelope';
import ButtonGroup from './ButtonGroup';
import Button from './Button';

const EmailDownload = props => (
  <div>
    <ButtonGroup>
      <Button type="success" onClick={props.downloadFunction}><FaDownload style={{ verticalAlign: 'top', marginTop: '2px' }} /> Download</Button>
    </ButtonGroup>
    <ButtonGroup style={{ marginBottom: '5px', marginRight: '5px' }}>
      <Button type="success" onClick={props.emailFunction}><FaEnvelope style={{ verticalAlign: 'top', marginTop: '2px' }} /> Email</Button>
    </ButtonGroup>
  </div>
);

EmailDownload.propTypes = {
  emailFunction: PropTypes.func,
  downloadFunction: PropTypes.func,
};

EmailDownload.defaultProps = {
  emailFunction: null,
  downloadFunction: null,
};

export default EmailDownload;
