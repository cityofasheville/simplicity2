import React from 'react';
import { graphql } from 'react-apollo';

import { query } from './slaDashboardQueries';

const DevelopmentSLADashboard = (props) => {
  console.log (props.data.permits);
  return (
    <div>SLA Dashboard</div>
  );
};

DevelopmentSLADashboard.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};


export default graphql(query)(DevelopmentSLADashboard);

