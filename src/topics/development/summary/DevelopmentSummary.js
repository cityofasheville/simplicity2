import React from 'react';
import { Link } from 'react-router';

const DevelopmentSummary = props => (
  <div className="col-xs-12">
    <h1>Development Summary</h1>
    <Link to="/topics/development/sla-dashboard">SLA Dashboard</Link>
    { props.children }
  </div>
);

DevelopmentSummary.propTypes = {};

export default DevelopmentSummary;
