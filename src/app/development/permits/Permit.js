import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Map from '../../../shared/visualization/Map';

// Make query based on URL, render sub components depending on query results

const GET_PERMIT = gql`
  query getPermitsQuery($permit_numbers: [String]) {
    permits(permit_numbers: $permit_numbers) {
      permit_number
      permit_description
      permit_group
      permit_type
      permit_subtype
      permit_category
      applicant_name
      applied_date
      status_current
      status_date
      created_by
      building_value
      job_value
      total_project_valuation
      total_sq_feet
      fees
      paid
      balance
      invoiced_fee_total
      address
      x
      y
      contractor_names
      internal_record_id
      custom_fields {
        type
        name
        value
      }
      comments {
        comment_seq_number
        comment_date
        comments
      }
    }
  }
`;

const Permit = (props) => (
  <Query
    query={GET_PERMIT}
    variables={{
      permit_numbers: [props.routeParams.id],
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error || data.permits.length === 0) {
        console.log(error);
        return <div>Error :( </div>;
      }
      if (data.permits.length > 1) {
        console.log('This is not quite right: ', data)
      }

      const thisPermit = data.permits[0];
      const formattedPermit = Object.assign({}, thisPermit)

      // These are all the "misc" info fields that may or may not be filled out for any permit
      thisPermit.custom_fields.forEach(customField =>
        formattedPermit[customField.name] = customField.value)

      // The popup is what you see when you click on the pin
      const mapData = [Object.assign(
        {},
        thisPermit,
        {
          popup: `<b>${thisPermit.address}</b>`
        },
      )];
      // Don't show map if there are no coordinates
      const showMap = thisPermit.y && thisPermit.x;

      const dateFormatter = (inputDate) => new Date(inputDate).toLocaleDateString('en-US')
      const fieldFormatters = {
        applied_date: {
          valueFormatter: dateFormatter,
        },
        status_date: {
          valueFormatter: dateFormatter,
        },
        contractor_names: {
          valueFormatter: namesArray => Object.values(namesArray).join(', '),
        },
        Pinnumber: {
          keyFormatter: () => 'Pin Number',
          valueFormatter: (pin) => (
            <a
              href={`/property?search=${pin}&id=${pin}&entities=undefined&entity=property`}
            >
              {pin}
            </a>
          ),
        }
      }
      // These fields are shown in the summary area
      const firstGroupFields = [
        'address',
        'applied_date',
        'permit_number',
        'status_current',
        'status_date',
        'Pinnumber',
      ];
      // These fields are handled in a special way and shouldn't just be iterated over
      const specialFields = [
        'permit_description',
        'custom_fields',
        'x',
        'y',
        'comments',
        // TODO: SHOULD WE INCLUDE COMMENTS?
      ].concat(firstGroupFields)

      return (<div className="container">
        <div className="row">
          <h1 className="title__text">{formattedPermit.permit_subtype} {formattedPermit.permit_type} Permit</h1>
          {showMap && (<div className="col-sm-12 col-md-6">
            <div className="map-container" style={{ height: '300px' }}>
              <Map
                data={mapData}
                center={[thisPermit.y, thisPermit.x]}
                height="100%"
                width="100%"
              />
            </div>
          </div>)}
          <div className={`col-sm-12 col-md-${showMap ? 6 : 12}`}>
            <h2>Summary</h2>
            <p>{formattedPermit.permit_description}</p>
          </div>
          <dl className="dl-horizontal">
            {firstGroupFields.map(d => (<div className="col-sm-12 col-md-6" key={d}>
              <dt
              className="text-left text-capitalize"
              >
              {fieldFormatters[d] && fieldFormatters[d]['keyFormatter'] ? fieldFormatters[d]['keyFormatter'](d) : d.split('_').join(' ')}:
              </dt>
              <dd className="text-right">{fieldFormatters[d] && fieldFormatters[d]['valueFormatter'] ?
                fieldFormatters[d]['valueFormatter'](formattedPermit[d]) : formattedPermit[d]}</dd>
              </div>))
            }
          </dl>
        </div>
        <div className="row">
          <h2>Details</h2>
          <dl className="dl-horizontal">
            {Object.keys(formattedPermit)
              .filter(d => specialFields.indexOf(d) === -1 && +formattedPermit[d] !== 0)
              .map(d => (<div className="col-sm-12 col-md-6" key={d}>
              <dt
              className="text-left text-capitalize"
              >
              {d.split('_').join(' ')}:
              </dt>
              <dd className="text-right">{typeof formattedPermit[d] !== 'object' ?
              formattedPermit[d] :
              Object.keys(formattedPermit[d]).map(k => `${k}: ${formattedPermit[d][k]}`)}</dd>
              </div>))
            }
          </dl>
        </div>
      </div>);
    }}
  </Query>
);

export default Permit;
