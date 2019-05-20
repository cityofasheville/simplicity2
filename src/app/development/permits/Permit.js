import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitsMap from './PermitsMap';
import PermitDataSection from './PermitDataSection';
import TypePuck from '../trc/TypePuck';
import { trcProjectTypes, statusTranslation } from '../utils';

const GET_PERMIT = gql`
  query getPermitsQuery($permit_numbers: [String]) {
    permits(permit_numbers: $permit_numbers) {
      permit_number
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
      let trcType;
      if (thisPermit.permit_group === 'Planning') {
        trcType = Object.values(trcProjectTypes).find(type =>
          type.permit_type === thisPermit.permit_type &&
          type.permit_subtype === thisPermit.permit_subtype);
      }
      const formattedPermit = Object.assign({}, thisPermit, { trcType });
      // These are all the "misc" info fields that may or may not be filled out for any permit
      thisPermit.custom_fields.forEach((customField) => {
        formattedPermit[customField.name.toLowerCase().split(' ').join('_')] = customField.value;
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

      const currentStatusItem = statusTranslation.find(item =>
        item.accelaSpeak === formattedPermit.status_current);

      return (
        <div className="container">
          <h1 className="title__text">{formattedPermit.application_name}</h1>
          <p className="permit-description">{formattedPermit.permit_description}</p>
          <p className="permit-description">{`This application was submitted on ${dateFormatter(formattedPermit.applied_date)}.  ${currentStatusItem ? currentStatusItem.statusText : ''}`}</p>
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
              <PermitDataSection detailsSet="project details" formattedPermit={formattedPermit} />
              {trcType !== undefined && (
                <div style={{ display: 'flex', marginTop: '1rem' }}>
                  <a style={{ marginRight: '1em' }} href="/development/major">
                    <TypePuck
                      typeObject={trcType}
                    />
                  </a>
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
            <div className="col-sm-12 col-md-6 permit-details-card">
              <h2>Zoning Details</h2>
              <PermitDataSection detailsSet="zoning details" formattedPermit={formattedPermit} />
            </div>
            <div className="col-sm-12 col-md-6 permit-details-card">
              <h2>Environmental Details</h2>
              <PermitDataSection detailsSet="environment details" formattedPermit={formattedPermit} />
            </div>
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
