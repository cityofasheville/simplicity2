import React from 'react';

const MySimpliCity = props => (
  <div className="">
    <h1>My SimpliCity</h1>
    { props.children }
  </div>
);

MySimpliCity.propTypes = {
  children: React.PropTypes.node,
};

export default MySimpliCity;
