import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { nest } from 'd3-collection';
import LoadingAnimation from '../../../shared/LoadingAnimation';


class GranularVolume extends React.Component {
  constructor() {
    super();
    this.state = {
      hover: null,
      timeSpan: [],
      parentNode: 'root',
    };
  }

  makeDataHierarchy() {

  }

  render() {
    if (this.props.data.loading) {
      return <LoadingAnimation />
    }

    console.log(this.props.data.permits_by_address)
    return (<div>
      <h1>Permit Volume II</h1>
      {/* Permit hierarchy filter buttons */}
      {/* Checkbox legend - more like checkboxes */}
      {/* zoomable circlepack that reflects permit hierarchy buttons */}
      {/* brushable histogram that reflects time picker-- label brush with annotation?  add timespan to title of all graphs and page? */}
      <div id="permitValue">
        <h2>Value</h2>
      </div>
      {/* Value Section */}
      {/* Fees Section */}
      {/* Open, Closed, Issued Section */}
      {/* Percent Opened Online Section */}
      {/* Inspections by Type */}
      {/* PAC by type */}
    </div>);
  }
}

const getPermitsQuery = gql`
  query getPermitsQuery($civicaddress_id: Int!, $radius: Int, $after: String) {
    permits_by_address(civicaddress_id: $civicaddress_id, radius: $radius, after: $after) {
        permit_number
        permit_group
        permit_type
        permit_subtype
        permit_category
        permit_description
        applicant_name
        applied_date
        status_current
        status_date
        civic_address_id
        address
        x
        y
    }
  }
`;

export default graphql(getPermitsQuery, {
  options: {
    variables: {
      civicaddress_id: 9688,
      radius: 26400,
      after: 'Thu Jul 01 2018',
    },
  },
})(GranularVolume);
