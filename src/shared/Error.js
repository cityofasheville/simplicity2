import React from 'react';
import PropTypes from 'prop-types';

const Error = props => (
  <div className="row">
    <div className="col-sm-12">
      <div className="alert alert-danger alert-sm">
        <p>
          There was an error reaching the server. You may report issues using <a href="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1" target="_blank" style={{ color: '#fff', textDecoration: 'underline' }}>this form</a>.
        </p>
        <p>
          <span>Error details: </span>{props.message}
        </p>
      </div>
    </div>
  </div>
);

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
