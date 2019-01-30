import React from 'react';
import Icon from '../shared/Icon';
import { IM_GITHUB } from '../shared/iconConstants';

const Footer = () => (
  <div>
    <div className="clear-footer"></div>
    <footer className="footer">
      <div className="container">
        <div className="col-sm-12">
          <div style={{ fontStyle: 'italic' }} className="text-center">We strive for full accessibility. Report issues to <a className="inText" href="mailto:help@ashevillenc.gov?Subject=SimpliCity%20Feedback" target="_top" title="Help desk feedback email link">help@ashevillenc.gov</a>.
          </div>
          <div className="text-center" style={{ fontStyle: 'italic', marginBottom: '2px' }}>It&apos;s open source! Fork it on <a href="https://github.com/cityofasheville/simplicity2" target="_blank">GitHub <Icon path={IM_GITHUB} size={23} /></a></div>
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
