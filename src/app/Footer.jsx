import React from 'react';
import Icon from '../shared/Icon';
import { IM_GITHUB } from '../shared/iconConstants';

const Footer = () => (
  <footer className="bg-light border-t border-blue-dark px-6 py-4 mt-8">
    <div className="col-sm-12">
      <div className="text-center">
        We strive for full accessibility. Report issues with this website through our
        <a
          className="ml-1"
          href="https://docs.google.com/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform"
          target="_blank"
          rel="noopener noreferrer"
          title="Provide Feedback"
        >
          feedback form
        </a>
        .
      </div>
      <div className="text-center mb-1">
        It&apos;s open source! Fork it on{' '}
        <a href="https://github.com/cityofasheville/simplicity2" target="_blank">
          GitHub <Icon ariaHidden="true" path={IM_GITHUB} size={23} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
