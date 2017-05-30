import React from 'react';
import PropTypes from 'prop-types';

const MySimpliCity = props => (
  <div className="">
    <h1>My SimpliCity</h1>
    { props.children }
  </div>
);

MySimpliCity.propTypes = {
  children: PropTypes.node,
};

export default MySimpliCity;
