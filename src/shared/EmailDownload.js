import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from './ButtonGroup';
import Button from './Button';

const EmailDownload = props => (
  <div>
    <ButtonGroup>
      <Button type="success" icon="download" text="Download" onClick={props.downloadFunction} />
    </ButtonGroup>
    <ButtonGroup style={{ marginBottom: '5px', marginRight: '5px' }}>
      <Button type="success" icon="envelope" text="Email" onClick={props.emailFunction} />
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
