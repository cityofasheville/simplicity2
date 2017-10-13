import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import LoadingAnimation from '../../shared/LoadingAnimation';
import PieChart from '../../shared/visualization/PieChart';
import DevelopmentTable from '../development/DevelopmentTable';
import EmailDownload from '../../shared/EmailDownload';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';

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

const DevelopmentResults = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  return (
    <div>
      <div className="row">
        <div className="col-xs-12">
          <div className="pull-left">
            <EmailDownload emailFunction={() => (console.log('email!'))} downloadFunction={() => (console.log('Download!'))} />
          </div>
          <ButtonGroup>
            <LinkButton pathname="/development" query={Object.assign({}, props.location.query, { view: 'summary' })} positionInGroup="left" active={props.location.query.view === 'summary'}>Summary</LinkButton>
            <LinkButton pathname="/development" query={Object.assign({}, props.location.query, { view: 'list' })} active={props.location.query.view === 'list'} positionInGroup="middle">List view</LinkButton>
            <LinkButton pathname="/development" query={Object.assign({}, props.location.query, { view: 'map' })} active={props.location.query.view === 'map'} positionInGroup="right">Map view</LinkButton>
          </ButtonGroup>
        </div>
      </div>

      <div className="row">
        <div id="summaryView" className="col-xs-12" hidden={props.location.query.view !== 'summary'}>
          <PieChart data={testPieDevelopmentData} altText="Development pie chart" />
        </div>

        <div id="listView" hidden={props.location.query.view !== 'list'}>
          <DevelopmentTable data={testPermitData} />
        </div>

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
          Map view
        </div>
      </div>
    </div>
  );
};

DevelopmentResults.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

DevelopmentResults.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

const getPermitsQuery = gql`
  query permitsQuery($id: ID!) {
    mda_permits (id: $id) {
      objectid
      record_id
      record_name
      date_opened
      record_status
      record_status_date
      address
    }
  }
`;

const DevelopmentResultsGQL = graphql(getPermitsQuery, {
  options: ownProps => ({
    variables: {
      civicaddress_id: ownProps.location.query.id,
      radius: (ownProps.location.query.within === '' || ownProps.location.query.within === undefined) ? '83' : ownProps.location.query.within,
      before: moment.utc().format('YYYY-MM-DD'),
      after: () => {
        let after = '1970-01-01';
        const duringURL = (ownProps.location.query.during === '' || ownProps.location.query.during === undefined) ? '30' : ownProps.location.query.during;
        if (duringURL !== 'all') {
          after = moment.utc().subtract((parseInt(duringURL, 10) + 1), 'd').format('YYYY-MM-DD');
        }
        return after;
      },
    },
  }),
})(DevelopmentResults);

export default DevelopmentResultsGQL;
