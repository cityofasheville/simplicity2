import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import Icon from './Icon';
import { IM_DOWNLOAD7 } from './iconConstants';
import ButtonGroup from './ButtonGroup';
import Button from './Button';

const EmailDownload = props => (
  <div className="email-download">
    <CSVLink data={props.downloadData} filename={props.fileName || 'data.csv'}>
      <Button type="success" size="xs">
        <Icon path={IM_DOWNLOAD7} /> {props.text ? props.text : 'download'}
      </Button>
    </CSVLink>
    {/* <ButtonGroup style={{ marginBottom: '5px', marginRight: '5px' }}>
      <Button type="success" onClick={props.emailFunction}><Icon path={IM_ENVELOP5} /> Email</Button>
    </ButtonGroup> */}
  </div>
);

EmailDownload.propTypes = {
  emailFunction: PropTypes.func,
  downloadData: PropTypes.array,
  fileName: PropTypes.string,
  text: PropTypes.string,
};

EmailDownload.defaultProps = {
  emailFunction: null,
  downloadData: [],
};

export default EmailDownload;
