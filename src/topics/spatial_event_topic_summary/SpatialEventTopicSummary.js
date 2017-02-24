import React from 'react';
import BarChart from '../../components/BarChart';
import SpatialEventTopicFilters from '../spatial_event_topic_filters/SpatialEventTopicFilters';
import EmailDownload from '../../components/EmailDownload';
import SpatialEventTopicList from '../spatial_event_topic_list/SpatialEventTopicList';

const testData = [
  { name: 'Crimes', 'Aggravated assault': 123, Burglary: 1000, Larceny: 1500, 'Larceny of Motor Vehicle': 2500, Robbery: 100, Vandalism: 4000 },
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
      <h1 className="col-xs-6">{props.spatialEventTopic}</h1>
      <div className="col-xs-6">
        <EmailDownload />
      </div>
    </div>

    <SpatialEventTopicFilters spatialEventTopic={props.spatialEventTopic} spatialType="address" spatialDescription="123 Main Street" />

    <div className="row">
      <div className="col-xs-12">
        <div className="btn-group pull-right">
          <button className="btn btn-primary">Summary</button>
          <button className="btn btn-primary">List view</button>
          <button className="btn btn-primary">Map view</button>
        </div>
      </div>
    </div>

    <div className="row">
      <div id="summaryView" className="col-xs-12" style={{ height: '400px' }} hidden>
        <BarChart data={testData} chartTitle={[props.spatialEventTopic, 'Summary'].join(' ')} barDataKeys={['Aggravated assault', 'Burglary', 'Larceny', 'Larceny of Motor Vehicle', 'Robbery', 'Vandalism']} xAxisDataKey="name" />
      </div>

      <div id="listView">
        <SpatialEventTopicList spatialEventTopic="Crime" listData={testCrimeData} />
      </div>

      <div id="mapView" className="col-xs-12" hidden>
        Map view
      </div>
    </div>
  </div>
);

SpatialEventTopicSummary.propTypes = {
  spatialEventTopic: React.PropTypes.string.isRequired,
};

export default SpatialEventTopicSummary;
