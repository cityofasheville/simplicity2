import React from 'react';
import MaintenanceList from './MaintenanceList';

const testMaintenanceData = [
  {
    AuthorityName: 'NCDOT',
    CenterlineID: '9649109985',
    Street: 'Montford Ave',
  },
  {
    AuthorityName: 'CITY OF ASHEVILLE',
    CenterlineID: '9649040073',
    Street: 'Montford Ave',
  },
  {
    AuthorityName: 'CITY OF ASHEVILLE',
    CenterlineID: '9649041105',
    Street: 'Montford Ave',
  },
];

const renderHeader = (type, text) => {
  switch (type) {
    case 'address':
      return (
        <div>
          <h1><button className="btn btn-primary pull-right">Back</button>{text}</h1>
          <h3>Maintenance at this address</h3>
        </div>
      );
    case 'street':
      return (
        <div>
          <h1><button className="btn btn-primary pull-right">Back</button>{text}</h1>
          <h3>Maintenance along this street</h3>
        </div>
      );
    default:
      return (<h1>Street maintenance</h1>);
  }
};

const Maintenance = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        {renderHeader(props.entity, props.searchText)}
      </div>
    </div>
    <div className="row">
      <MaintenanceList listData={testMaintenanceData} />
    </div>
  </div>
);

Maintenance.propTypes = {
  entity: React.PropTypes.string,
  searchText: React.PropTypes.string,
};

Maintenance.defaultProps = {
  entity: 'street',
  searchText: 'Montford Ave, 28801',
};

export default Maintenance;
