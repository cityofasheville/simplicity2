import React from 'react';
import PropTypes from 'prop-types';
import PermitsTableWrapper from '../trc/PermitsTableWrapper';


// todo: add time slider


const PermitsIndex = (props) => (
  <div>
    <PermitsTableWrapper
      permit_groups={['Planning', 'Permits', 'Services']}
    />
  </div>
);

export default PermitsIndex;
