import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { graphql } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import Map from '../../shared/visualization/Map';
import { getBoundsFromStreetData, convertStreetLinesToLatLngArrays } from '../../utilities/mapUtilities';
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
      return require('../../images/Office.png');
    case 'Fire':
      return require('../../images/Fire.png');
    case 'Residential':
      return require('../../images/Home2.png');
    case 'Sign':
      return require('../../images/Direction.png');
    case 'Event-Temporary Use':
      return require('../../images/Users4.png');
    case 'Historical':
      return require('../../images/Library2.png');
    case 'Over The Counter':
      return require('../../images/Mug.png');
    case 'Outdoor Vendor':
      return require('../../images/Cook.png');
    case 'Development':
      return require('../../images/City.png');
    default:
      return require('../../images/Ellipsis.png');
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

const DevelopmentByStreet = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  const mapData = props.data.permits_by_street.map(item => (
    Object.assign(
      {},
      item,
      {
        popup: `<div><b>${item.permit_type}</b><p>${moment.utc(item.applied_date).format('M/DD/YYYY')}</p><p><b>Project</b>:<div>${item.application_name}</div></p><p><b>Contractor(s):</b> ${item.contractor_names.map((contractor, index) => `<div>${contractor}: ${item.contractor_license_numbers[index]}</div>`).join('')}</p></div>`,
        options: {
          icon: L.icon({
            iconUrl: getMarker(item.permit_type),
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [2, -22],
          })
        }
      }
    )
  ));

  const getNewUrlParams = view => (
    {
      view,
    }
  );

  return (
    <div>
      <div className="row">
        <div className="col-xs-12 template-header__inner">
          <div className="pull-left" style={{ marginTop: '10px', marginBottom: '15px' }}>
            <EmailDownload downloadData={props.data.permits_by_street} fileName="permits_by_street.csv" />
          </div>
          <ButtonGroup alignment="right">
            <Button onClick={() => refreshLocation(getNewUrlParams('map'), props.location)} active={props.location.query.view === 'map'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('list'), props.location)} active={props.location.query.view === 'list'} positionInGroup="middle">List view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('summary'), props.location)} positionInGroup="right" active={props.location.query.view === 'summary'}>Chart</Button>
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
            <Map data={mapData} legend={createLegend(props.data.permits_by_street)} within={props.location.query.within} bounds={getBoundsFromStreetData(props.data.streets)} drawStreet streetData={convertStreetLinesToLatLngArrays(props.data.streets)} zoomToPoint={(props.location.query.zoomToPoint !== undefined && props.location.query.zoomToPoint !== '') ? props.location.query.zoomToPoint : null} />
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
      application_name
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
      centerline_ids: ownProps.location.query.id.trim().split(',').map(x=>+x),
      radius: ownProps.radius,
      before: ownProps.before,
      after: ownProps.after,
    },
  }),
})(DevelopmentByStreet);

export default DevelopmentByStreetGQL;
