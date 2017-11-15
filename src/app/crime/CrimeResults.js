import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { graphql } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import LoadingAnimation from '../../shared/LoadingAnimation';
import PieChart from '../../shared/visualization/PieChart';
import Map from '../../shared/visualization/Map';
import CrimeTable from '../crime/CrimeTable';
import EmailDownload from '../../shared/EmailDownload';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';

const getMarker = (type) => {
  switch (type) {
    case 'MISSING PERSON REPORT':
    case 'RUNAWAY JUVENILE':
      return require('../../shared/UserQuestion.png');
    case 'DAMAGE TO PERSONAL PROPERTY':
    case 'VANDALISM':
      return require('../../shared/Hammer.png');
    case 'ASSAULT - SIMPLE':
    case 'ASSAULT ON FEMALE':
    case 'ASSAULT W/DEADLY WEAPON':
      return require('../../shared/Ambulance.png');
    case 'COMMUNICATING THREAT':
      return require('../../shared/BubbleMad.png');
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
      return require('../../shared/GunForbidden.png');    
    case 'RESIST, DELAY, OBSTRUCT OFFICER':
    case 'CIT INCIDENT':
    case 'DV ASSISTANCE OTHER':
    case 'VICTIM ASSISTANCE OTHER':
    case 'ASSAULT ON GOVERNMENT OFFICIAL':
      return require('../../shared/Shield3.png');
    case 'DWI':
    case 'UNAUTHORIZED USE OF MOTOR VEHICLE':
      return require('../../shared/CarCross.png');
    case 'LARCENY OF MV OTHER':
    case 'LARCENY OF MV AUTO':
    case 'LARCENY OF MV TRUCK':
      return require('../../shared/CarLock2.png');
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
      return require('../../shared/MoneyPouch.png');
    default:
      return require('../../shared/Ellipsis.png');
  }
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

const CrimeResults = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  const pieData = convertToPieData(props.data.crimes_by_address);
  const mapData = props.data.crimes_by_address.map(item => (Object.assign({}, item, { popup: `<div><b>${item.address}</b><p>${moment.utc(item.date_occurred).format('M/DD/YYYY')}</p><p>${item.offense_long_description}</p></div>`, options: { icon: L.icon({
    iconUrl: getMarker(item.offense_long_description),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [2, -22],
  }) } })
  ));

  return (
    <div>
      <div className="row">
        <div className="col-xs-12">
          <div className="pull-left">
            <EmailDownload emailFunction={() => (console.log('email!'))} downloadFunction={() => (console.log('Download!'))} />
          </div>
          <ButtonGroup>
            <LinkButton pathname="/crime" query={Object.assign({}, props.location.query, { view: 'summary' })} positionInGroup="left" active={props.location.query.view === 'summary'}>Summary</LinkButton>
            <LinkButton pathname="/crime" query={Object.assign({}, props.location.query, { view: 'list' })} active={props.location.query.view === 'list'} positionInGroup="middle">List view</LinkButton>
            <LinkButton pathname="/crime" query={Object.assign({}, props.location.query, { view: 'map' })} active={props.location.query.view === 'map'} positionInGroup="right">Map view</LinkButton>
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
          <CrimeTable data={props.data.crimes_by_address} />
        </div>

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
          {props.data.crimes_by_address.length === 0 ?
            <div className="alert alert-info">No results found</div>
            :
            <Map data={mapData} center={props.location.query.x !== '' ? [parseFloat(props.location.query.x), parseFloat(props.location.query.y)] : null} centerLabel={props.location.query.label} drawCircle radius={parseInt(props.location.query.within, 10) / 3} />
          }
        </div>
      </div>
    </div>
  );
};

CrimeResults.propTypes = {
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

CrimeResults.defaultProps = {
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

const CrimeResultsGQL = graphql(getCrimesQuery, {
  options: ownProps => ({
    variables: {
      civicaddress_id: ownProps.location.query.id,
      radius: ownProps.radius,
      before: ownProps.before,
      after: ownProps.after,
    },
  }),
})(CrimeResults);

export default CrimeResultsGQL;
