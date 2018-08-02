import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import Icon from './Icon';
import { IM_DOWNLOAD7 } from './iconConstants';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import { withLanguage } from '../utilities/lang/LanguageContext';

const spanish = {
  Email: 'Mandar correo electr\xF3',
  Download: 'Descargar',
};

const english = {
  Email: 'Email',
  Download: 'Download',
};

const translate = (value, language) => {
  switch (language) {
    case 'Spanish':
      return spanish[value];
    case 'English':
      return english[value];
    default:
      return value;
  }
};

const EmailDownload = props => (
  <div className="email-download">
    <CSVLink data={props.downloadData} filename={props.fileName || 'data.csv'}>
      <Button type="success" size="xs"><Icon path={IM_DOWNLOAD7} /> {translate('Download', props.language.language)}</Button>
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
  lang: PropTypes.string,
};

EmailDownload.defaultProps = {
  emailFunction: null,
  downloadData: [],
  lang: 'English',
};

export default withLanguage(EmailDownload);
