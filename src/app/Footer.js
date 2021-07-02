import React from 'react';
import Icon from '../shared/Icon';
import { IM_GITHUB } from '../shared/iconConstants';

const Footer = () => (
  <div style={{ marginTop: 32 }}>
    <div className="clear-footer"></div>
    <footer className="footer">
      <div className="container">
        <div className="col-sm-12">
          <div style={{ fontStyle: 'italic' }} className="text-center">We strive for full accessibility. Report issues with this website through our <a className="inText" href="https://goo.gl/forms/XC9l7PTylog6Q9B83" target="_blank" rel="noopener noreferrer" title="feedback form link">feedback form</a>.
          </div>
          <div className="text-center" style={{ fontStyle: 'italic', marginBottom: '2px' }}>It&apos;s open source! Fork it on <a href="https://github.com/cityofasheville/simplicity2" target="_blank">GitHub <Icon path={IM_GITHUB} size={23} /></a></div>
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
