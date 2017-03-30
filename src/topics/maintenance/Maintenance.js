import React from 'react';
import MaintenanceList from './MaintenanceList';
import EmailDownload from '../../components/EmailDownload';

const testFunc = (props) => {
  console.log(props);
};

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

const renderHeader = (query) => {
  switch (query.entity) {
    case 'address':
      return (
        <div>
          <h1><button className="btn btn-primary pull-right">Back</button>{query.label}</h1>
          <h3 style={{ display: 'inline' }}>Maintenance at this address</h3>
          <EmailDownload emailFunction={testFunc} downloadFunction={testFunc} args={query} />
        </div>
      );
    case 'street':
      return (
        <div>
          <h1><button className="btn btn-primary pull-right">Back</button>{query.label}</h1>
          <h3 style={{ display: 'inline' }}>Maintenance along this street</h3>
          <EmailDownload emailFunction={testFunc} downloadFunction={testFunc} args={query} />
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
        {renderHeader(props.location.query)}
      </div>
    </div>
    <div className="row">
      <MaintenanceList listData={testMaintenanceData} />
    </div>
  </div>
);

Maintenance.propTypes = {
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  label: React.PropTypes.string,
};

Maintenance.defaultProps = {
  location: { entity: 'street', label: 'Montford Ave, 28801' },
};

export default Maintenance;
