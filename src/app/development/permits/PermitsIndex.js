import React from 'react';
import PropTypes from 'prop-types';
import PermitsTableWrapper from '../trc/PermitsTableWrapper';


// should proabbaly just be a big ol table with links to other stuff

const PermitsIndex = (props) => (
  <div>
    <PermitsTableWrapper
      permit_groups={['Planning', 'Permits', 'Services']}
    />
  </div>
);

export default PermitsIndex;
