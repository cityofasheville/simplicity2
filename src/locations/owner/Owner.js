import React from 'react';
import PropertyList from '../property/PropertyList';

const testPropertyData = [
  {
    PropertyName: '99999 BENNETT RD Unit',
    CivicAddressID: '91291231',
    PIN: '8695992975000000',
  },
  {
    PropertyName: '333 HAZEL MILL RD Unit',
    CivicAddressID: '21066',
    PIN: '9638904490000000',
  },
];

const Owner = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.location.query.label}</h1>
        <h3>About this owner's properties</h3>
      </div>
    </div>
    <div className="row">
      <PropertyList listData={testPropertyData} />
    </div>
  </div>
);

Owner.propTypes = {
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default Owner;
