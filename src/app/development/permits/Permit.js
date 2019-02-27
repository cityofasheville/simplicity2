import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment';
import { Query } from 'react-apollo';
import PermitTasks from './PermitTasks';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Map from '../../../shared/visualization/Map';
import { trcProjectTypes } from '../trc/utils';

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
      job_value
      total_project_valuation
      total_sq_feet
      address
      x
      y
      internal_record_id
      contractor_names
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

// TODO: RETURN NULL IF THERE ISN'T A VALUE?  OR LEAVE IT BLANK?
const DtSet = props => (
  <div className="DtSet">
    <dt
      className="text-left text-capitalize"
    >
      {props.fieldFormatters[props.datum] && props.fieldFormatters[props.datum].keyFormatter ?
        props.fieldFormatters[props.datum].keyFormatter(props.datum) : props.datum.split('_').join(' ')
      }:
    </dt>
    <dd>
      {props.fieldFormatters[props.datum] && props.fieldFormatters[props.datum].valueFormatter ?
        props.fieldFormatters[props.datum].valueFormatter(props.formattedPermit[props.datum]) :
        props.formattedPermit[props.datum]
      }
    </dd>
  </div>
);

const Permit = props => (
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
        console.log('This is not quite right: ', data);
      }

      const thisPermit = data.permits[0];
      const formattedPermit = Object.assign({}, thisPermit);

      // These are all the "misc" info fields that may or may not be filled out for any permit
      thisPermit.custom_fields.forEach((customField) => {
        formattedPermit[customField.name] = customField.value;
      });

      // The popup is what you see when you click on the pin
      const mapData = [Object.assign(
        {},
        thisPermit,
        {
          popup: `<b>${thisPermit.address}</b>`,
        },
      )];
      // Don't show map if there are no coordinates
      const showMap = thisPermit.y && thisPermit.x;

      const dateFormatter = inputDate => moment(new Date(inputDate)).format('MM/DD/YYYY');
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
        'permit_number', // TODO: MAKE THIS THE LINK TO ACA
        'status_current',
        'status_date',
        'Pinnumber',
      ];

      /*
      make address a link to simplicity
      make permit number a link to ACA
      show number of units if not 0 - include at top
      show affordable housing at top - only if number of units is not 0
      permit permit_description - as is
      group, type, subtype, cat - show a nice version at the top
      overall record status - make it "current review status" - do not include status date

      include in details section at bottom
      construction value - from fields
      total prop size - from fields, add unit of acres
      subdivision # lots - yes
      total sq feet - yes, not from fields?
      zoning district - from fields, link to municode, call it "current zoning district"
      */


      // label workflow tasks as timeline instead of recent updates
      // add applied date, initial trc date if it exists
      const additionalTimelineEvents = [
        // {
        //   current_status_date:,
        //   task:,
        //   task_status:,
        // },
      ]

      // make contact section - applicant name, contractor names, planner name if available
      const contactInfoFields = [
        'applicant_name',
        'contractor_names',
        // TODO: PLANNER NAME?
      ]

      // These fields are handled in a special way and shouldn't just be iterated over
      const specialFields = [
        'permit_description',
        'custom_fields',
        'x',
        'y',
        'comments',
        // TODO: SHOULD WE INCLUDE COMMENTS?
      ].concat(firstGroupFields)

      const detailsFields = Object.keys(formattedPermit)
        .filter(d => specialFields.indexOf(d) === -1 && +formattedPermit[d] !== 0);
      const halfLengthDetails = Math.ceil(detailsFields.length / 2);

      // Sample ACA link
      // https://services.ashevillenc.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=19CAP&capID2=00000&capID3=000NZ&agencyCode=ASHEVILLE

      return (<div className="container">
        <div className="row">
          <h1 className="title__text">{formattedPermit.permit_subtype} {formattedPermit.permit_type} Application</h1>
          {showMap && (<div className="col-sm-12 col-md-6">
            <div className="map-container" style={{ height: `${firstGroupFields.length * 4}em` }}>
              <Map
                data={mapData}
                center={[formattedPermit.y, formattedPermit.x]}
                height="100%"
                width="100%"
              />
            </div>
          </div>)}
          <div className={`col-sm-12 col-md-${showMap ? 6 : 12}`}>
            <h2>Summary</h2>
            <p className="summary-group">{formattedPermit.permit_description}</p>
            <dl className="dl-horizontal summary-group">
              {firstGroupFields.map(d => (<DtSet
                key={d}
                datum={d}
                fieldFormatters={fieldFormatters}
                formattedPermit={formattedPermit}
              />))}
            </dl>
            {formattedPermit.permit_group === 'Planning' &&
              Object.values(trcProjectTypes).map(type => type.permit_subtype).indexOf(formattedPermit.permit_subtype) > -1 &&
              <p><em>This is a major development.  <a href="/development/major">Learn more</a> about the large-scale development process in Asheville.</em></p>
            }
          </div>
        </div>
        <div className="row">
          <h2>Timeline</h2>
          <PermitTasks {...props} />
          <p>To see more details about this permit, look it up in <a href="https://services.ashevillenc.gov/CitizenAccess" target="_blank" rel="noopener noreferrer">Accela Citizen Access</a>.</p>
        </div>
        <div className="row">
          <h2>Details</h2>
          <dl className="dl-horizontal col-sm-12 col-md-6">
            {detailsFields.slice(0, halfLengthDetails)
              .map(d => (<DtSet
                key={d}
                datum={d}
                fieldFormatters={fieldFormatters}
                formattedPermit={formattedPermit}
              />))
            }
          </dl>
          <dl className="dl-horizontal col-sm-12 col-md-6">
            {detailsFields.slice(halfLengthDetails, detailsFields.length)
              .map(d => (<DtSet
                key={d}
                datum={d}
                fieldFormatters={fieldFormatters}
                formattedPermit={formattedPermit}
              />))
            }
          </dl>
        </div>
      </div>);
    }}
  </Query>
);

export default Permit;
