import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { graphql } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import Map from '../../shared/visualization/Map';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import PieChart from '../../shared/visualization/PieChart';
import DevelopmentTable from '../development/DevelopmentTable';
import EmailDownload from '../../shared/EmailDownload';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import { refreshLocation } from '../../utilities/generalUtilities';

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

const createLegend = (permitData) => {
  const permitTypes = [];
  let permitTypeAlreadyPresent;
  for (let i = 0; i < permitData.length; i += 1) {
    permitTypeAlreadyPresent = false;
    for (let j = 0; j < permitData.length; j += 1) {
      if (permitTypes[j] === permitData[i].permit_type) {
        permitTypeAlreadyPresent = true;
        break;
      }
    }
    if (!permitTypeAlreadyPresent) {
      permitTypes.push(permitData[i].permit_type);
    }
  }
  return (
    <div style={{ width: '160px' }}>
      {permitTypes.map(type => (
        <div key={`legendItem-${type}`} style={{ width: '160px', marginBottom: '5px' }}><img src={getMarker(type)} style={{ display: 'inline-block', width: '25px', verticalAlign: 'top' }}></img><span style={{ marginLeft: '5px', display: 'inline-block', width: '130px' }}>{type}</span></div>
      ))}
    </div>
  );
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

const DevelopmentByAddress = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  const mapData = props.data.permits_by_address.map(item => (Object.assign({}, item, { popup: `<div><b>${item.permit_type}</b><p>${moment.utc(item.applied_date).format('M/DD/YYYY')}</p><p><b>Applicant</b>:<div>${item.applicant_name}</div></p><p><b>Contractor(s):</b> ${item.contractor_names.map((contractor, index) => `<div>${contractor}: ${item.contractor_license_numbers[index]}</div>`).join('')}</p></div>`, options: { icon: L.icon({
    iconUrl: getMarker(item.permit_type),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [2, -22],
  }) } })
  ));

  const getNewUrlParams = view => (
    {
      view,
    }
  );

  return (
    <div>
      <div className="row">
        <div className="col-xs-12">
          <div className="pull-left" style={{ marginTop: '10px', marginBottom: '15px' }}>
            <EmailDownload downloadData={props.data.permits_by_address} fileName="permits_by_address.csv" />
          </div>
          <ButtonGroup>
            <Button onClick={() => refreshLocation(getNewUrlParams('map'), props.location)} active={props.location.query.view === 'map'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('list'), props.location)} active={props.location.query.view === 'list'} positionInGroup="middle">List view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('summary'), props.location)} positionInGroup="right" active={props.location.query.view === 'summary'}>Chart</Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="row">
        <div id="summaryView" className="col-xs-12" hidden={props.location.query.view !== 'summary'}>
          {props.data.permits_by_address.length === 0 ?
            <div className="alert alert-info">No results found</div>
            :
            <PieChart data={convertToPieData(props.data.permits_by_address)} altText="Development pie chart" />
          }
        </div>

        <div id="listView" hidden={props.location.query.view !== 'list'}>
          <DevelopmentTable data={props.data.permits_by_address} location={props.location} />
        </div>

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
          {props.data.permits_by_address.length === 0 || props.location.query.view !== 'map' ?
            <div className="alert alert-info">No results found</div>
            :
            <Map
              data={mapData}
              showCenter
              legend={createLegend(props.data.permits_by_address)}
              center={props.location.query.y !== '' ? [parseFloat(props.location.query.y), parseFloat(props.location.query.x)] : null}
              centerLabel={props.location.query.label}
              drawCircle
              radius={(props.location.query.within === undefined || props.location.query.within === '') ? 27 : parseInt(props.location.query.within, 10) / 3}
              within={(props.location.query.within === undefined || props.location.query.within === '') ? 83 : parseInt(props.location.query.within, 10)}
              zoomToPoint={(props.location.query.zoomToPoint !== undefined && props.location.query.zoomToPoint !== '') ? props.location.query.zoomToPoint : null}
            />
          }
        </div>
      </div>
    </div>
  );
};

DevelopmentByAddress.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

DevelopmentByAddress.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

const getPermitsQuery = gql`
  query getPermitsQuery($civicaddress_id: Int!, $radius: Int, $before: String, $after: String) {
    permits_by_address (civicaddress_id: $civicaddress_id, radius: $radius, before: $before, after: $after) {
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
  }
`;

const DevelopmentByAddressGQL = graphql(getPermitsQuery, {
  options: ownProps => ({
    variables: {
      civicaddress_id: ownProps.location.query.id.trim(),
      radius: ownProps.radius,
      before: ownProps.before,
      after: ownProps.after,
    },
  }),
})(DevelopmentByAddress);

export default DevelopmentByAddressGQL;
