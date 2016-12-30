import React from 'react';
import { Link } from 'react-router';

const Development = props => (
  <div className="">
    <h1>Citywide Development</h1>
    <Link to="/topics/development/sla-dashboard">SLA Dashboard</Link>
    { props.children }
  </div>
);

Development.propTypes = {
  children: React.PropTypes.node,
};

export default Development;

