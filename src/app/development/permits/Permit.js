import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitsMap from './PermitsMap';
import PermitTimeline from './PermitTimeline';
import { permitFieldFormats } from './permitFieldFormats';
import { orderedDates } from '../trc/textContent';
import { getTRCTypeFromPermit } from '../trc/utils';
import { statusTranslation } from '../utils';

const GET_PERMIT = gql`
  query getPermitsQuery($permit_numbers: [String]) {
    permits(permit_numbers: $permit_numbers) {
      permit_number
      internal_record_id
      permit_group
      permit_type
      permit_subtype
      permit_category
      permit_description
      application_name
      applied_date
      status_current
      status_date
      job_value
      total_sq_feet
      civic_address_id
      address
      technical_contact_name
      technical_contact_email
      x
      y
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
          )
        );

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

      const currentStatusItem = statusTranslation.find(item =>
        item.accelaSpeak === formattedPermit.status_current);

      const byDetailArea = {};
      permitFieldFormats
        // If there is no display label, bring it to the top
        .sort(a => (!a.displayLabel ? -1 : 0))
        .forEach((d) => {
          const val = formattedPermit[d.accelaLabel];
          // if (!val) {
          //   return;
          // }
          const formattedDisplayVal = d.formatFunc ? d.formatFunc(val, formattedPermit) : val;
          if (!formattedDisplayVal) {
            // Format functions return null if it should not show
            return;
          }
          if (!byDetailArea[d.displayGroup]) {
            byDetailArea[d.displayGroup] = [];
          }
          if (!d.displayLabel) {
            byDetailArea[d.displayGroup].push(
              <div className="permit-form-group bool" key={d.accelaLabel}>
                {formattedDisplayVal}
              </div>
            );
          } else {
            byDetailArea[d.displayGroup].push(
              <div className="permit-form-group" key={d.accelaLabel}>
                <div className="display-label">{d.displayLabel}</div>
                <div className="formatted-val">{formattedDisplayVal}</div>
              </div>
            );
          }
        });

      return (
        <div className="container">
          <h1 className="title__text">{formattedPermit.application_name}</h1>
          <p className="permit-description">{formattedPermit.permit_description}</p>
          <p className="permit-description">{`City staff accepted this application on ${dateFormatter(formattedPermit.applied_date)}.  ${currentStatusItem ? currentStatusItem.statusText : ''}`}</p>
          {formattedPermit.trcType && formattedPermit.orderedDates.length > 0 &&
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
              {trcType !== undefined && (
                <div style={{ display: 'flex', marginTop: '1rem' }}>
                  <p>
                    <em>
                      This is a major development.  <a href="/development/major">Learn more</a> about the large-scale development process in Asheville.
                    </em>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            {byDetailArea['zoning details'] !== undefined &&
              <div className="col-sm-12 col-md-6 permit-details-card">
                <h2>Zoning Details</h2>
                {byDetailArea['zoning details'].map(d => d)}
              </div>
            }
            {byDetailArea['environment details'] !== undefined &&
              <div className="col-sm-12 col-md-6 permit-details-card">
                <h2>Environmental Details</h2>
                {byDetailArea['environment details'].map(d => d)}
              </div>
            }
          </div>
        </div>
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
