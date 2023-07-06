import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitsMap from './PermitsMap';
import PermitSearchBar from './PermitSearchBar';
import PermitTimeline from './PermitTimeline';
import { permitFieldFormats } from './utils';
import { orderedDates } from '../trc/textContent';
import { getTRCTypeFromPermit } from '../trc/utils';
import { statusTranslation } from '../utils';

const GET_PERMIT = gql`
  query getPermitsQuery($permit_numbers: String) {
    permit_realtime(permit_number: $permit_numbers) {
      permit_number
      permit_group
      permit_type
      permit_subtype
      permit_category
      permit_description
      applicant_name
      application_name
      applied_date
      status_current
      status_date
      technical_contact_name
      technical_contact_email
      created_by
      building_value
      job_value
      total_project_valuation
      total_sq_feet
      fees
      paid
      balance
      invoiced_fee_total
      civic_address_id
      address
      x
      y
      contractor_names
      contractor_license_numbers
      internal_record_id
      comments {
        comment_date
        comment_seq_number
        comments
      }
      custom_fields {
        type
        name
        value
      }
    }
  }
`;

const dateFormatter = inputDate => moment(new Date(inputDate)).format('MMMM DD, YYYY');

const Permit = props => (
  <Query
    query={GET_PERMIT}
    variables={{
      permit_numbers: props.routeParams.id,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error || data.permit_realtime === undefined || data.permit_realtime.length === 0) {
        let message = '';
        if (error) {
          console.log('GQL error');
          console.log(error);
          message = 'There was an error retrieving ID '
        } else {
          console.log('GQL returned no results');
          message = 'No permit found for ID '
        }
        return (
          <div className="container">
            <h1 className="title__text">Permit Details</h1>
            <div className="alert alert-warning">
              {message} "{props.routeParams.id}". Please verify the permit ID and try again.
            </div>
            <PermitSearchBar />
          </div>
        );
      }
      if (data.permit_realtime !== undefined && data.permit_realtime.length > 1) {
        console.log('More than one permit found. This is not quite right: ', data);
      }
      const thisPermit = data.permit_realtime;
      const trcType = getTRCTypeFromPermit(thisPermit);
      const formattedPermit = Object.assign({}, thisPermit, { trcType });
      
      // These are all the "misc" info fields that may or may not be filled out for any permit
      thisPermit.custom_fields.forEach((customField) => {
        formattedPermit[customField.name] = customField.value;
      });

      formattedPermit.setbacks = [];
      if (formattedPermit.front && formattedPermit.front > 0) {
        formattedPermit.setbacks.push(`front: ${formattedPermit.front} feet`);
      }
      if (formattedPermit.corner_side && formattedPermit.corner_side > 0) {
        formattedPermit.setbacks.push(`side or corner: ${formattedPermit.corner_side} feet`);
      }
      if (formattedPermit.rear && formattedPermit.rear > 0) {
        formattedPermit.setbacks.push(`rear: ${formattedPermit.rear} feet`);
      }

      formattedPermit.orderedDates = orderedDates
        .filter(dateObject => formattedPermit[dateObject.accelaLabel])
        .map(dateObject =>
          Object.assign(
            {},
            dateObject,
            {
              dateInput: formattedPermit[dateObject.accelaLabel],
            }
          ));

      // The popup is what you see when you click on the pin
      const mapData = [Object.assign(
        {},
        formattedPermit,
        {
          popup: `<b>${formattedPermit.address}</b>`,
        },
      )];
      // Don't show map if there are no coordinates
      const showMap = formattedPermit.y && formattedPermit.x;

      const accelaStatus = formattedPermit.status_current;
      const permitBalance = formattedPermit.balance;

      const currentStatusItem = statusTranslation.find(item =>
        item.accelaSpeak === formattedPermit.status_current);

      const byDetailArea = {};
      permitFieldFormats
        // If there is no display label, bring it to the top
        .sort(a => (!a.displayLabel ? -1 : 0))
        .forEach((d) => {
          const val = formattedPermit[d.accelaLabel];
          // If current data record does not have a value for a particular permit field, 
          // skip rest of this foreach callback and go to the next permit field
          if (!val) {
            return;
          }
          const formattedDisplayVal = d.formatFunc ? d.formatFunc(val, formattedPermit) : val;
          if (!formattedDisplayVal) {
            // Format functions return null if it should not show
            return;
          }
          if (!byDetailArea[d.displayGroup]) {
            byDetailArea[d.displayGroup] = [];
          }
          if (!d.displayLabel) {
            byDetailArea[d.displayGroup].push((
              <div className="permit-form-group bool" key={d.accelaLabel}>
                {formattedDisplayVal}
              </div>
            ));
          } else {
            byDetailArea[d.displayGroup].push((
              <div className="permit-form-group" key={d.accelaLabel}>
                <div className="display-label">{d.displayLabel}</div>
                <div className="formatted-val">{formattedDisplayVal}</div>
              </div>
            ));
          }
        });

      const catchAllACALink = `https://services.ashevillenc.gov/CitizenAccess/Cap/GlobalSearchResults.aspx?isNewQuery=yes&QueryText=${formattedPermit.permit_number}`;
      let acaLink = catchAllACALink;
      
      const internalRecordParts = formattedPermit.internal_record_id.split("-");

      if (internalRecordParts !== undefined && internalRecordParts.length === 3) {
        const baseCapURL = 'https://services.ashevillenc.gov/CitizenAccess/Cap/CapDetail.aspx';
        if (formattedPermit.permit_group === 'Permits' || formattedPermit.permit_group === 'Planning' || formattedPermit.permit_group === 'Planning') {
          acaLink = `${baseCapURL}?Module=${formattedPermit.permit_group}&TabName=${formattedPermit.permit_group}&capID1=${internalRecordParts[0]}&capID2=${internalRecordParts[1]}&capID3=${internalRecordParts[2]}&agencyCode=ASHEVILLE`;
        } 
      } 

      const resubmittalPortal = 'https://develop.ashevillenc.gov/revised-applicationamendment';

      function compareValues(key = 'dateInput', order = 'asc') {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // if property doesn't exist on either object
            return 0;
          }
      
          const varA = new Date(a[key]); 
          const varB = new Date(b[key]); 
      
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
      }

      formattedPermit.orderedDates.sort(compareValues());

      return (
        <main className="container">
          <h1 className="title__text">Permit Details</h1>
          <h2 className="title__text">{formattedPermit.application_name}</h2>
          <p className="permit-description">{formattedPermit.permit_description}</p>
          <p className="permit-description">{`City staff began processing this application on ${dateFormatter(formattedPermit.applied_date)}.  ${currentStatusItem ? currentStatusItem.statusText : ''}`}</p>
          {formattedPermit.orderedDates !== undefined && formattedPermit.trcType && formattedPermit.orderedDates.length > 0 &&
            <PermitTimeline
              formattedPermit={formattedPermit}
              dateFormatter={dateFormatter}
              currentStatusItem={currentStatusItem}
            />
          }
          <div className="row permit-map-row">
            {showMap && (
              <div className="col-sm-12 col-md-6 permit-map-container">
                <PermitsMap
                  permitData={mapData}
                  centerCoords={[formattedPermit.y, formattedPermit.x]}
                  zoom={14}
                />
              </div>
            )}
            <div className={`col-sm-12 col-md-${showMap ? 6 : 12} permit-details-card`}>
              {byDetailArea['project details'] !== undefined &&
                byDetailArea['project details'].map(d => d)}

                {accelaStatus &&
                  <div className="permit-form-group">
                    <div className="display-label">Current Status</div>
                    <div className="formatted-val"><a href={acaLink} target="_blank" rel="noopener noreferrer">{accelaStatus}</a></div>
                  </div>
                }

                <h3>For Applicants: Work with this Application</h3>
                <div className="permit-form-group">
                  <div style={{marginRight: 16}}>
                    <ul>
                    <li className="margin-y">
                    <a href={acaLink}
                        target="_blank"
                        rel="noopener noreferrer">
                      Check application status details</a>                      
                    </li>

                    <li className="margin-b">
                    <a href={acaLink}
                        target="_blank"
                        rel="noopener noreferrer">
                      Pay application fees</a><br /> 
                      {permitBalance ? 'There is an outstanding balance on this application' : 'There is a zero balance on this application'}                   
                    </li>

                    <li className="margin-b">
                    <a href={acaLink}
                        target="_blank"
                        rel="noopener noreferrer">
                      Pick up an approved application or review comments</a>                      
                    </li>

                    <li className="margin-b">
                    <a href={acaLink}
                        target="_blank"
                        rel="noopener noreferrer">
                      Schedule an inspection (login required)</a>                      
                    </li>

                    <li className="margin-b">
                    <a href={resubmittalPortal}
                        target="_blank"
                        rel="noopener noreferrer">
                      Submit updated documents or an amended application</a>
                    </li>
                    </ul>
                  </div>
                </div>

              {trcType !== undefined && (
                <div style={{ display: 'flex', marginTop: '1rem' }}>
                  <p>
                    <em>
                    This is an application made for development or permitting by a private individual that is being reviewed by the City of Asheville.  
                    <a href="/development/major">Learn more</a> about the development review process in Asheville.
                    </em>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            {byDetailArea['zoning details'] !== undefined &&
              <div className="col-sm-12 col-md-6 permit-details-card">
                <h3>Zoning Details</h3>
                {byDetailArea['zoning details'].map(d => d)}
              </div>
            }
            {byDetailArea['environment details'] !== undefined &&
              <div className="col-sm-12 col-md-6 permit-details-card">
                <h3>Environmental Details</h3>
                {byDetailArea['environment details'].map(d => d)}
              </div>
            }
          </div>
          <hr />
          <div className="row" style={{marginBottom: "32px"}}>
            <div className="col-xs-12">
              <h2>Look Up Another Application</h2>
              <PermitSearchBar />
            </div>
          </div>
        </main>
      );
    }}
  </Query>
);

Permit.propTypes = {
  routeParams: PropTypes.shape({
    id: PropTypes.string,
  }),
};

Permit.defaultProps = {
  routeParams: {
    id: '',
  },
};

export default Permit;
