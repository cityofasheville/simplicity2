import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import { timeDay, timeMonday, timeWeek, timeMonth, timeYear } from 'd3-time';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitsTable from './PermitsTable';

const GET_PROJECTS = gql`
  query getPermitsQuery($date_field: String!, $after: String, $before: String, $permit_groups: [String]) {
    permits(date_field: $date_field, after: $after, before: $before, permit_groups: $permit_groups) {
      applicant_name
      applied_date
      permit_category
      permit_group
      permit_number
      permit_subtype
      permit_type
      status_current
      status_date
      address
    }
  }
`;


const PermitsTableWrapper = (props) => (
  <Query
    query={GET_PROJECTS}
    variables={{
      date_field: 'applied_date',
      after: moment(props.after).format('YYYY-MM-DD hh:mm:ss GMT'),
      before: moment(props.before).format('YYYY-MM-DD hh:mm:ss GMT'),
      permit_groups: props.permit_groups,
    }}
  >
    {({ loading, error, data }) => {
      console.log('permits table wrapper props', props.after, props.before)
      if (loading) return <LoadingAnimation />;
      if (error) {
        console.log(error);
        return <div>Error :( </div>;
      }

      let filteredData = data.permits;

      if (props.projectTypes) {
        filteredData = data.permits.filter(d => {
          let typeOfInterest = false;
          Object.values(props.projectTypes).forEach(type => {
            // ASSUMING THEY ARE ALL PLANNING
            if (d.permit_type === type.permit_type && d.permit_subtype === type.permit_subtype) {
              typeOfInterest = typeOfInterest || true;
            }
          })
          return typeOfInterest;
        })
      }

      return (<PermitsTable data={filteredData} {...props}/>);
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
