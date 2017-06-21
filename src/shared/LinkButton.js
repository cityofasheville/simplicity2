import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Button from './Button';

const LinkButton = props => (
  <Link to={{ pathname: props.pathname, query: props.query }}>
    <Button {...props} />
  </Link>
);

LinkButton.propTypes = {
  pathname: PropTypes.string,
  query: PropTypes.object, // eslint-disable-line
};

export default LinkButton;
