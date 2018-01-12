import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import Map from '../../shared/visualization/Map';
import { getBoundsFromStreetData, convertStreetLinesToLatLngArrays } from '../../utilities/mapUtilities';
import LoadingAnimation from '../../shared/LoadingAnimation';
import PieChart from '../../shared/visualization/PieChart';
import DevelopmentTable from '../development/DevelopmentTable';
import EmailDownload from '../../shared/EmailDownload';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';

const getMarker = (type) => {
  switch (type) {
    case 'Commercial':
      return require('../../shared/Office.png');
    case 'Fire':
      return require('../../shared/Fire.png');
    case 'Residential':
      return require('../../shared/Home2.png');
    case 'Sign':
      return require('../../shared/Direction.png');
    case 'Event-Temporary Use':
      return require('../../shared/Users4.png');
    case 'Historical':
      return require('../../shared/Library2.png');
    case 'Over The Counter':
      return require('../../shared/Mug.png');
    case 'Outdoor Vendor':
      return require('../../shared/Cook.png');
    case 'Development':
      return require('../../shared/City.png');
    default:
      return require('../../shared/Ellipsis.png');
  }
};

const convertToPieData = (permitData) => {
  let pieData = [];
  let permitTypeAlreadyPresent;
  for (let i = 0; i < permitData.length; i += 1) {
    permitTypeAlreadyPresent = false;
    for (let j = 0; j < pieData.length; j += 1) {
      if (pieData[j].name === permitData[i].permit_type) {
        pieData[j].value += 1;
        permitTypeAlreadyPresent = true;
        break;
      }
    }
    if (!permitTypeAlreadyPresent) {
      pieData.push(Object.assign({}, {}, { name: permitData[i].permit_type, value: 1 }));
    }
  }

  pieData.sort((a, b) => (
    ((a.value > b.value) ? -1 : ((a.value < b.value) ? 1 : 0)) // eslint-disable-line
  ));

  let otherCount = 0;
  for (let i = 9; i < pieData.length; i += 1) {
    otherCount += pieData[i].value;
  }
  if (pieData.length > 8) {
    pieData = pieData.slice(0, 9).concat({ name: 'Other', value: otherCount });
  }

  return pieData;
};

const testPieDevelopmentData = [
  { name: 'Planning Level I', value: 12345 },
  { name: 'Planning Level II', value: 1000 },
  { name: 'Planning Level III', value: 15000 },
];

const testPermitData = [
  { PermitName: 'A permit name something', PermitType: 'Residential', PermitSubType: 'Permit subtype', AppliedDate: '01/01/2001', PermitNum: '1234567879', PermitCategory: 'Planning Level I', Address: '12 Main Street, Apt 4, 20001', PermitGroup: 'Residential', UpdatedDate: '02/02/2001', CurrentStatus: 'Issued', LicenseNumber: '1234A-123', Contractor: 'Bob Jones' },
  { PermitName: 'My permit name', PermitType: 'Commercial', PermitSubType: 'Permit subtype', AppliedDate: '01/01/2001', PermitNum: '1234567879', PermitCategory: 'Planning Level II', Address: '12 Main Street, 28804', PermitGroup: 'Commercial', UpdatedDate: '02/02/2001', CurrentStatus: 'Issued', LicenseNumber: '1234A-123', Contractor: 'Bob Jones' },
  { PermitName: 'Riverridge condos', PermitType: 'Residential', PermitSubType: 'Permit subtype', AppliedDate: '01/01/2001', PermitNum: '1234567879', PermitCategory: 'permit category', Address: '12 Main Street, 23456', PermitGroup: 'Residential', UpdatedDate: '02/02/2001', CurrentStatus: 'Issued', LicenseNumber: '1234A-123', Contractor: 'Bob Jones' },
];

const DevelopmentByStreet = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  const mapData = props.data.permits_by_street.map(item => (Object.assign({}, item, { popup: `<div><b>${item.permit_type}</b><p>${moment.utc(item.applied_date).format('M/DD/YYYY')}</p><p><b>Applicant</b>:<div>${item.applicant_name}</div></p><p><b>Contractor(s):</b> ${item.contractor_names.map((contractor, index) => `<div>${contractor}: ${item.contractor_license_numbers[index]}</div>`).join('')}</p></div>`, options: { icon: L.icon({
    iconUrl: getMarker(item.permit_type),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [2, -22],
  }) } })
  ));

  const refreshLocation = (view) => {
    browserHistory.push([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&within=', document.getElementById('extent').value, '&during=', document.getElementById('time').value, '&hideNavbar=', props.location.query.hideNavbar, '&search=', props.location.query.search, '&view=', view, '&x=', props.location.query.x, '&y=', props.location.query.y].join(''));
  };

  return (
    <div>
      <div className="row">
        <div className="col-xs-12">
          <div className="pull-left">
            <EmailDownload emailFunction={() => (console.log('email!'))} downloadFunction={() => (console.log('Download!'))} />
          </div>
          <ButtonGroup>
            <Button onClick={() => refreshLocation('map')} active={props.location.query.view === 'map'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation('list')} active={props.location.query.view === 'list'} positionInGroup="middle">List view</Button>
            <Button onClick={() => refreshLocation('summary')} positionInGroup="right" active={props.location.query.view === 'summary'}>Chart</Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="row">
        <div id="summaryView" className="col-xs-12" hidden={props.location.query.view !== 'summary'}>
          {props.data.permits_by_street.length === 0 ?
            <div className="alert alert-info">No results found</div>
            :
            <PieChart data={convertToPieData(props.data.permits_by_street)} altText="Development pie chart" />
          }
        </div>

        <div id="listView" hidden={props.location.query.view !== 'list'}>
          <DevelopmentTable data={props.data.permits_by_street} location={props.location} />
        </div>

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
          {props.data.permits_by_street.length === 0 || props.location.query.view !== 'map' ?
            <div className="alert alert-info">No results found</div>
            :
            <Map data={mapData} within={props.location.query.within} bounds={getBoundsFromStreetData(props.data.streets)} drawStreet streetData={convertStreetLinesToLatLngArrays(props.data.streets)} zoomToPoint={(props.location.query.zoomToPoint !== undefined && props.location.query.zoomToPoint !== '') ? props.location.query.zoomToPoint : null} />
          }
        </div>
      </div>
    </div>
  );
};

DevelopmentByStreet.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

DevelopmentByStreet.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

const getPermitsAndStreetInfoQuery = gql`
  query getPermitsAndStreetInfoQuery($centerline_ids: [Float], $radius: Int, $before: String, $after: String) {
    permits_by_street (centerline_ids: $centerline_ids, radius: $radius, before: $before, after: $after) {
      permit_number
      permit_group
      permit_type
      permit_subtype
      permit_description
      applicant_name
      applied_date
      status_date
      civic_address_id
      address
      x
      y
      contractor_names
      contractor_license_numbers
      comments {
        comment_seq_number
        comment_date
        comments
      }
    }
    streets (centerline_ids: $centerline_ids) {
      centerline_id
        left_zipcode
        right_zipcode
        line {
          x
          y
        }
    }    
  }
`;

const DevelopmentByStreetGQL = graphql(getPermitsAndStreetInfoQuery, {
  options: ownProps => ({
    variables: {
      centerline_ids: ownProps.location.query.id.split(','),
      radius: ownProps.radius,
      before: ownProps.before,
      after: ownProps.after,
    },
  }),
})(DevelopmentByStreet);

export default DevelopmentByStreetGQL;
