import React from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import PieChart from '../../shared/visualization/PieChart';
import SpatialEventTopicFilters from '../spatial_event_topic_summary/SpatialEventTopicFilters';
import EmailDownload from '../../shared/EmailDownload';
import SpatialEventTopicList from '../spatial_event_topic_summary/SpatialEventTopicList';
import Icon from '../../shared/Icon';
import { IM_SHIELD3, IM_OFFICE } from '../../shared/iconConstants';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import Button from '../../shared/Button';

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

const getIcon = (topic) => {
  switch (topic) {
    case 'crime':
      return <Icon path={IM_SHIELD3} size={35} />
    case 'Development':
      return <Icon path={IM_OFFICE} size={30} />
  }
}

const SpatialEventTopicSummary = props => (
  <div>
    <PageHeader h1={props.spatialEventTopic.charAt(0).toUpperCase() + props.spatialEventTopic.slice(1)} icon={getIcon(props.spatialEventTopic)}>
      <ButtonGroup>
        <Button onClick={browserHistory.goBack}>Back</Button>
      </ButtonGroup>
    </PageHeader>
    <SpatialEventTopicFilters spatialEventTopic={props.spatialEventTopic} spatialType={props.query.entity} spatialDescription={props.query.label} />

    <div className="row">
      <div className="col-xs-12">
        <div className="pull-left">
          <EmailDownload emailFunction={() => (console.log('email!'))} downloadFunction={() => (console.log('Download!'))} />
        </div>
        <ButtonGroup>
          <LinkButton pathname={['/', props.spatialEventTopic].join('')} query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar, view: 'summary' }} positionInGroup="left" active={props.location.query.view === 'summary'}>Summary</LinkButton>
          <LinkButton pathname={['/', props.spatialEventTopic].join('')} query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar, view: 'list' }} active={props.location.query.view === 'list'} positionInGroup="middle">List view</LinkButton>
          <LinkButton pathname={['/', props.spatialEventTopic].join('')} query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar, view: 'map' }} active={props.location.query.view === 'map'} positionInGroup="right">Map view</LinkButton>
        </ButtonGroup>
      </div>
    </div>

    <div className="row">
      <div id="summaryView" className="col-xs-12" hidden={props.location.query.view !== 'summary'}>
        <PieChart data={props.spatialEventTopic === 'crime' ? testPieCrimeData : testPieDevelopmentData} altText={[props.spatialEventTopic, 'pie chart'].join(' ')} />
      </div>

      <div id="listView" hidden={props.location.query.view !== 'list'}>
        <SpatialEventTopicList spatialEventTopic={props.spatialEventTopic.toLowerCase()} listData={props.spatialEventTopic === 'crime' ? testCrimeData : testPermitData} />
      </div>

      <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
        Map view
      </div>
    </div>
  </div>
);

SpatialEventTopicSummary.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

SpatialEventTopicSummary.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

export default SpatialEventTopicSummary;
