import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { graphql } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import PieChart from '../../shared/visualization/PieChart';
import Map from '../../shared/visualization/Map';
import CrimeTable from '../crime/CrimeTable';
import EmailDownload from '../../shared/EmailDownload';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import { refreshLocation } from '../../utilities/generalUtilities';

const getMarker = (type) => {
  switch (type) {
    case 'MISSING PERSON REPORT':
    case 'RUNAWAY JUVENILE':
      return require('../../shared/User.png');
    case 'DAMAGE TO PERSONAL PROPERTY':
    case 'VANDALISM':
      return require('../../shared/Hammer.png');
    case 'ASSAULT - SIMPLE':
    case 'ASSAULT ON FEMALE':
    case 'ASSAULT W/DEADLY WEAPON':
      return require('../../shared/Ambulance.png');
    case 'COMMUNICATING THREAT':
      return require('../../shared/Bubble.png');
    case 'INTIMIDATING STATE WITNESS':
    case 'PERJURY':
    case 'OBSTRUCTION OF JUSTICE':
      return require('../../shared/Library2.png');
    case 'FRAUD':
    case 'FRAUD-CREDIT CARD':
    case 'FALSE PRETENSE - OBTAIN PROPERTY BY':
    case 'IMPERSONATE':
      return require('../../shared/Profile.png');
    case 'CARRYING CONCEALED WEAPON':
      return require('../../shared/Gun.png');
    case 'RESIST, DELAY, OBSTRUCT OFFICER':
    case 'CIT INCIDENT':
    case 'DV ASSISTANCE OTHER':
    case 'VICTIM ASSISTANCE OTHER':
    case 'ASSAULT ON GOVERNMENT OFFICIAL':
      return require('../../shared/Shield3.png');
    case 'DWI':
    case 'UNAUTHORIZED USE OF MOTOR VEHICLE':
      return require('../../shared/Car.png');
    case 'LARCENY OF MV OTHER':
    case 'LARCENY OF MV AUTO':
    case 'LARCENY OF MV TRUCK':
      return require('../../shared/Car.png');
    case 'TRESPASS':
      return require('../../shared/Fence.png');
    case 'INFORMATION ONLY':
      return require('../../shared/Pencil7.png');
    case 'DRUG PARAPHERNALIA POSSESS':
    case 'DRUG OFFENSE - FELONY':
    case 'DRUG OFFENSE - MISDEMEANOR':
    case 'DRUG PARAPHERNALIA OTHER':
      return require('../../shared/AidKit2.png');     
    case 'COUNTERFEITING-BUYING/RECEIVING':
      return require('../../shared/BillDollar.png');
    case 'LARCENY ALL OTHER':
    case 'LARCENY FROM BUILDING':
    case 'LARCENY FROM MOTOR VEHICLE':
    case 'ROBBERY - COMMON LAW':
    case 'ROBBERY - ARMED - KNIFE':
      return require('../../shared/Dollar.png');
    default:
      return require('../../shared/Ellipsis.png');
  }
};

const createLegend = (crimeData) => {
  const crimeTypes = [];
  let crimeTypeAlreadyPresent;
  for (let i = 0; i < crimeData.length; i += 1) {
    crimeTypeAlreadyPresent = false;
    for (let j = 0; j < crimeTypes.length; j += 1) {
      if (crimeTypes[j] === crimeData[i].offense_long_description) {
        crimeTypeAlreadyPresent = true;
        break;
      }
    }
    if (!crimeTypeAlreadyPresent) {
      crimeTypes.push(crimeData[i].offense_long_description);
    }
  }
  return (
    <div style={{ width: '160px' }}>
      {crimeTypes.map(type => (
        <div key={`legendItem-${type}`} style={{ width: '160px', marginBottom: '5px' }}><img src={getMarker(type)} style={{ display: 'inline-block', width: '25px', verticalAlign: 'top' }}></img><span style={{ marginLeft: '5px', display: 'inline-block', width: '130px' }}>{type}</span></div>
      ))}
    </div>
  );
};

const convertToPieData = (crimeData) => {
  // Group crimes to less categories?? Right now just show top 8 and Other
  let pieData = [];
  let crimeTypeAlreadyPresent;
  for (let i = 0; i < crimeData.length; i += 1) {
    crimeTypeAlreadyPresent = false;
    for (let j = 0; j < pieData.length; j += 1) {
      if (pieData[j].name === crimeData[i].offense_long_description) {
        pieData[j].value += 1;
        crimeTypeAlreadyPresent = true;
        break;
      }
    }
    if (!crimeTypeAlreadyPresent) {
      pieData.push(Object.assign({}, {}, { name: crimeData[i].offense_long_description, value: 1 }));
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

const CrimesByAddress = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  const pieData = convertToPieData(props.data.crimes_by_address);
  const mapData = props.data.crimes_by_address.map(item => (Object.assign({}, item, {
    popup: `<div><b>${item.address}</b><p>${moment.utc(item.date_occurred).format('M/DD/YYYY')}</p><p>${item.offense_long_description}</p></div>`,
    options: { icon: L.icon({
      iconUrl: getMarker(item.offense_long_description),
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
            <EmailDownload downloadData={props.data.crimes_by_address} fileName="crimes_by_address.csv" />
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
          {pieData.length > 0 ?
            <PieChart data={pieData} altText="Crime pie chart" />
            :
            <div className="alert alert-info">No results found</div>
          }
        </div>

        <div id="listView" hidden={props.location.query.view !== 'list'}>
          <CrimeTable data={props.data.crimes_by_address} location={props.location} />
        </div>

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
          {props.data.crimes_by_address.length === 0 || props.location.query.view !== 'map' ?
            <div className="alert alert-info">No results found</div>
            :
            <Map
              data={mapData}
              showCenter
              legend={createLegend(props.data.crimes_by_address)}
              center={props.location.query.x !== '' ? [parseFloat(props.location.query.y), parseFloat(props.location.query.x)] : null}
              centerLabel={props.location.query.label}
              drawCircle
              radius={(props.location.query.within === undefined || props.location.query.within === '') ? 215 : parseInt(props.location.query.within, 10) / 3}
              within={(props.location.query.within === undefined || props.location.query.within === '') ? 660 : parseInt(props.location.query.within, 10)}
              zoomToPoint={(props.location.query.zoomToPoint !== undefined && props.location.query.zoomToPoint !== '') ? props.location.query.zoomToPoint : null}
            />
          }
        </div>
      </div>
    </div>
  );
};

CrimesByAddress.propTypes = {
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

CrimesByAddress.defaultProps = {
  query: { entity: 'address', label: '123 Main street' },
};

const getCrimesQuery = gql`
  query getCrimesQuery($civicaddress_id: Int!, $radius: Int, $before: String, $after: String) {
    crimes_by_address (civicaddress_id: $civicaddress_id, radius: $radius, before: $before, after: $after) {
      case_number
      date_occurred
      address
      offense_long_description
      offense_short_description
      geo_beat
      x
      y
    }
  }
`;

const CrimesByAddressGQL = graphql(getCrimesQuery, {
  options: ownProps => ({
    variables: {
      civicaddress_id: ownProps.location.query.id.trim(),
      radius: ownProps.radius,
      before: ownProps.before,
      after: ownProps.after,
    },
  }),
})(CrimesByAddress);

export default CrimesByAddressGQL;
