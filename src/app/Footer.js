import React from 'react';
import Icon from '../shared/Icon';
import { IM_GITHUB } from '../shared/iconConstants';

const Footer = () => (
  <div>
    <div className="clear-footer"></div>
    <footer className="footer">
      <div className="container">
        <div style={{ fontStyle: 'italic' }} className="text-center">
          <p>
            We strive for full accessibility. Report issues with our 
            <a className="inText" href="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1" target="_blank" title="website feedback form">
              &nbsp;feedback form
            </a>.
          </p>
        </div>
        <div className="text-center">It&apos;s open source! Fork it on <a href="https://github.com/cityofasheville/simplicity2" target="_blank">GitHub <Icon path={IM_GITHUB} size={23} /></a></div>
      </div>
    </footer>
  </div>
);

export default Footer;

