import React from 'react';
import PieChart from '../../components/PieChart';
import SpatialEventTopicFilters from '../spatial_event_topic_filters/SpatialEventTopicFilters';
import EmailDownload from '../../components/EmailDownload';
import SpatialEventTopicList from '../spatial_event_topic_list/SpatialEventTopicList';

const testPieCrimeData = [
  { name: 'Aggravated assault', value: 123 },
  { name: 'Burglary', value: 1000 },
  { name: 'Larceny', value: 1500 },
  { name: 'Larceny of Motor Vehicle', value: 2500 },
  { name: 'Robbery', value: 750 },
  { name: 'Vandalism', value: 4000 },
];

const testPieDevelopmentData = [
  { name: 'Planning Level I', value: 12345 },
  { name: 'Planning Level II', value: 1000 },
  { name: 'Planning Level III', value: 15000 },
];

const testCrimeData = [
  { crime: 'Larceny', location: '123 Main Street, 28805', date: '01/01/2001', caseNumber: '1234567879', lawBeat: 'AC2' },
  { crime: 'Larceny of Motor Vehicle', location: '10 Main Street, 28803', date: '01/01/2002', caseNumber: '11111', lawBeat: 'AC3' },
  { crime: 'Larceny', location: '1 Main Street, Apt 17, 28805', date: '05/01/2001', caseNumber: '9999999', lawBeat: 'AC6' },
  { crime: 'Larceny', location: '12 Main Street', date: '06/16/2001', caseNumber: 'X12354999', lawBeat: 'AC3' },
  { crime: 'Larceny', location: '1234 Main Street', date: '01/01/2001', caseNumber: '00009990', lawBeat: 'AC2' },
];

const testPermitData = [
  { PermitName: 'A permit name something', PermitType: 'Residential', PermitSubType: 'Permit subtype', AppliedDate: '01/01/2001', PermitNum: '1234567879', PermitCategory: 'Planning Level I', Address: '12 Main Street, Apt 4, 20001', PermitGroup: 'Residential', UpdatedDate: '02/02/2001', CurrentStatus: 'Issued', LicenseNumber: '1234A-123', Contractor: 'Bob Jones' },
  { PermitName: 'My permit name', PermitType: 'Commercial', PermitSubType: 'Permit subtype', AppliedDate: '01/01/2001', PermitNum: '1234567879', PermitCategory: 'Planning Level II', Address: '12 Main Street, 28804', PermitGroup: 'Commercial', UpdatedDate: '02/02/2001', CurrentStatus: 'Issued', LicenseNumber: '1234A-123', Contractor: 'Bob Jones' },
  { PermitName: 'Riverridge condos', PermitType: 'Residential', PermitSubType: 'Permit subtype', AppliedDate: '01/01/2001', PermitNum: '1234567879', PermitCategory: 'permit category', Address: '12 Main Street, 23456', PermitGroup: 'Residential', UpdatedDate: '02/02/2001', CurrentStatus: 'Issued', LicenseNumber: '1234A-123', Contractor: 'Bob Jones' },
];

const SpatialEventTopicSummary = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>
          <button className="btn btn-primary pull-right">Back</button>
          {props.spatialEventTopic}
        </h1>
      </div>
    </div>

    <SpatialEventTopicFilters spatialEventTopic={props.spatialEventTopic} spatialType={props.query.entity} spatialDescription={props.query.label} />

    <div className="row">
      <div className="col-xs-12">
        <div className="pull-left">
          <EmailDownload />
        </div>
        <div className="btn-group pull-right" style={{ marginTop: '5px' }}>
          <button className="btn btn-primary">Summary</button>
          <button className="btn btn-primary">List view</button>
          <button className="btn btn-primary">Map view</button>
        </div>
      </div>
    </div>

    <div className="row">
      <div id="summaryView" className="col-xs-12" style={{ height: '400px' }}>
        <PieChart data={props.spatialEventTopic.toLowerCase() === 'crime' ? testPieCrimeData : testPieDevelopmentData} />
      </div>

      <div id="listView" hidden>
        <SpatialEventTopicList spatialEventTopic={props.spatialEventTopic} listData={props.spatialEventTopic.toLowerCase() === 'crime' ? testCrimeData : testPermitData} />
      </div>

      <div id="mapView" className="col-xs-12" hidden>
        Map view
      </div>
    </div>
  </div>
);

SpatialEventTopicSummary.propTypes = {
  spatialEventTopic: React.PropTypes.string.isRequired,
  query: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SpatialEventTopicSummary.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

export default SpatialEventTopicSummary;
