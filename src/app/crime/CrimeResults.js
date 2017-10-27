import React from 'react';
import PropTypes from 'prop-types';
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

const testPieCrimeData = [
  { name: 'Aggravated assault', value: 123 },
  { name: 'Burglary', value: 1000 },
  { name: 'Larceny', value: 1500 },
  { name: 'Larceny of Motor Vehicle', value: 2500 },
  { name: 'Robbery', value: 750 },
  { name: 'Vandalism', value: 4000 },
];

const testCrimeData = [
  { crime: 'Larceny', location: '123 Main Street, 28805', date: '01/01/2001', caseNumber: '12345678', lawBeat: 'AC2' },
  { crime: 'Larceny of Motor Vehicle', location: '10 Main Street, 28803', date: '01/01/2002', caseNumber: '11111111', lawBeat: 'AC3' },
  { crime: 'Larceny', location: '1 Main Street, Apt 17, 28805', date: '05/01/2001', caseNumber: '99999999', lawBeat: 'AC6' },
  { crime: 'Larceny', location: '12 Main Street', date: '06/16/2001', caseNumber: 'X1235499', lawBeat: 'AC3' },
  { crime: 'Larceny', location: '1234 Main Street', date: '01/01/2001', caseNumber: '00009990', lawBeat: 'AC2' },
];

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
  console.log(props.data.crimes_by_address);

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
          Map view
          <Map />
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
