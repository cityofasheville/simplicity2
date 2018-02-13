import React from 'react';

const Footer = () => (
  <div>
    <div
      style={{
        display: 'block',
        padding: '20px',
        height: '60px',
        width: '100%',
      }}
    />
    <footer className="footer">
      <div className="container">
        <p style={{ fontStyle: 'italic' }}>Our charts are colorblind friendly, and we strive for full accessibility. If you encounter any issues, please use our <a className="inText" href="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1" target="_blank" title="website feedback form">feedback form</a>.
        </p>
      </div>
    </footer>
  </div>
);

export default Footer;

