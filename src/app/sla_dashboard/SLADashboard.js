import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { query } from './SLADashboardQueries';

const DevelopmentSLADashboard = (props) => {
  console.log (props.data.permits);
  return (
    <div>SLA Dashboard</div>
  );
};

DevelopmentSLADashboard.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
};


export default graphql(query)(DevelopmentSLADashboard);

