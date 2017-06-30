import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { IM_DOWNLOAD7, IM_ENVELOP5 } from './iconConstants';
import ButtonGroup from './ButtonGroup';
import Button from './Button';

const EmailDownload = props => (
  <div>
    <ButtonGroup>
      <Button type="success" onClick={props.downloadFunction}><Icon path={IM_DOWNLOAD7} /> Download</Button>
    </ButtonGroup>
    <ButtonGroup style={{ marginBottom: '5px', marginRight: '5px' }}>
      <Button type="success" onClick={props.emailFunction}><Icon path={IM_ENVELOP5} /> Email</Button>
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
