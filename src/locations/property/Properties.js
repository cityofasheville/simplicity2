import React from 'react';
import PropertyList from './PropertyList';

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

const renderSubtitle = (entity) => {
  switch (entity) {
    case 'street':
      return (
        <h3>Properties along this street</h3>
      );
    case 'neighborhood':
      return (
        <h3>Properties in this neighborhood</h3>
      );
    default:
      return (<h3>Properties</h3>);
  }
};

const Properties = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.location.query.label}</h1>
        {renderSubtitle(props.location.query.entity)}
      </div>
    </div>
    <div className="row">
      <PropertyList listData={testPropertyData} />
    </div>
  </div>
);

Properties.propTypes = {
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default Properties;
