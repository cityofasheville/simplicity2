import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitsMap from './PermitsMap';
import PermitsTable from './PermitsTable';

const GET_PROJECTS = gql`
  query getPermitsQuery(
    $date_field: String!,
    $after: String,
    $before: String,
    $permit_groups: [String]
  ) {
    permits(
      date_field: $date_field,
      after: $after,
      before: $before,
      permit_groups: $permit_groups
    ) {
      application_name
      applied_date
      permit_category
      permit_description
      permit_group
      permit_number
      permit_subtype
      permit_type
      status_current
      status_date
      civic_address_id
      address
      x
      y
    }
  }
`;


const PermitsTableWrapper = props => (
  <Query
    query={GET_PROJECTS}
    variables={{
      date_field: 'applied_date',
      after: moment(props.after).subtract(1, 'hours').format('YYYY-MM-DD hh:mm:ss GMT'),
      before: moment(props.before).format('YYYY-MM-DD hh:mm:ss GMT'),
      permit_groups: props.permit_groups,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) {
        console.log(error);
        return <div>Error :( </div>;
      }

      let filteredData = data.permits;

      if (props.projectTypes) {
        filteredData = data.permits.filter((d) => {
          let typeOfInterest = false;
          Object.values(props.projectTypes).forEach((type) => {
            // ASSUMING THEY ARE ALL PLANNING
            if (d.permit_type === type.permit_type && d.permit_subtype === type.permit_subtype) {
              typeOfInterest = typeOfInterest || true;
            }
          });
          return typeOfInterest;
        });
      }
      return (<div className="col-sm-12">
        <div>
          <div className="map-container" style={{ height: '350px', width: '100%' }}>
            <a href="#permitsDataTable" className="skip-nav-link" onClick={e => { document.getElementById('permitsDataTable').focus()}}>
              This map contains information which is also represented in the table below.  Press enter to skip to the table or tab to continue to the map.
            </a>
            <PermitsMap
              permitData={filteredData.filter(d => d.x && d.y).map(d => Object.assign(
                {},
                d,
                {
                  popup: `<a href="/permits/${d.permit_number}">
                    ${d.application_name}</a><br/>
                    ${d.address}<br/>
                    ${d.permit_description}`,
                },
              ))}
              zoom={12}
              centerCoords={[35.5951, -82.5515]}
            />
          </div>
        </div>
        <div id="permitsDataTable">
          <PermitsTable data={filteredData} {...props} />
        </div>
      </div>);
    }}
  </Query>
);

PermitsTableWrapper.propTypes = {
  date_field: PropTypes.string,
  //  TODO: AFTER AND BEFORE AND PROJECTTYPES
  permit_groups: PropTypes.arrayOf(PropTypes.string),
};

PermitsTableWrapper.defaultProps = {
  date_field: 'applied_date',
  after: moment.utc().subtract(7, 'days').format('YYYY-MM-DD'),
  before: moment.utc().format('YYYY-MM-DD'),
  permit_groups: ['Permits', 'Planning', 'Services'],
};

export default PermitsTableWrapper;
