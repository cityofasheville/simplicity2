import React from 'react';
// import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitsMap from './PermitsMap';
import TypePuck from '../trc/TypePuck';
import { trcProjectTypes } from '../utils';
import { permitFieldFormats } from './permitFieldFormats';


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

// const fieldFormatters = {
//   applied_date: dateFormatter,
//   status_date: dateFormatter,
// };

// TODO: RETURN NULL IF THERE ISN'T A VALUE?  OR LEAVE IT BLANK?
const PermitDataSubset = props => (
  <div className="detailsFieldset__details-listings">
    {permitFieldFormats.filter(field => field.displayGroup === props.detailsSet).map(d => {
      const snakeCaseAccelaLabel = d.accelaLabel.toLowerCase().split(' ').join('_');
      const val =  props.formattedPermit[snakeCaseAccelaLabel];
      if (!val) {
        return;
      }
      const formattedDisplayVal = d.formatFunc ?   d.formatFunc(val, props.formattedPermit) : val;
      if (!formattedDisplayVal) {
        // Format functions return null if it should not show
        return;
      }
      if (!d.displayLabel) {
        return <div className="form-group form-group--has-content" key={d.accelaLabel}>{formattedDisplayVal}</div>;
      }
      return (<div className="form-group form-group--has-content" key={d.accelaLabel}>
        <div className="form-group__inner">
          <div className="form-group__label" style={{ fontWeight: 'bold' }}>
            {d.displayLabel}
          </div>
          <div className="form-group__value">
            {formattedDisplayVal}
          </div>
        </div>
      </div>)
    })}
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
      let trcType = undefined;
      if (thisPermit.permit_group === 'Planning') {
        trcType = Object.values(trcProjectTypes).find(type =>
          type.permit_type === thisPermit.permit_type &&
          type.permit_subtype === thisPermit.permit_subtype
        )
      }
      let formattedPermit = Object.assign({}, thisPermit, { trcType: trcType });
      // These are all the "misc" info fields that may or may not be filled out for any permit
      thisPermit.custom_fields.forEach((customField) => {
        formattedPermit[customField.name.toLowerCase().split(' ').join('_')] = customField.value;
      });

      formattedPermit.setbacks = [];
      if (formattedPermit.front) {
        formattedPermit.setbacks.push(`front: ${formattedPermit.front} feet`);
      }
      if (formattedPermit.corner_side) {
        formattedPermit.setbacks.push(`side or corner: ${formattedPermit.corner_side} feet`);
      }
      if (formattedPermit.rear) {
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

      return (<div className="container">
        <div className="row">
          <h1 className="title__text">{formattedPermit.application_name}</h1>
          {showMap && (<div className="col-sm-12 col-md-6">
            <div className="map-container" style={{ height: `75vh` }}>
              <PermitsMap
                permitData={mapData}
                centerCoords={[formattedPermit.y, formattedPermit.x]}
                zoom={14}
              />
            </div>
          </div>)}
          <div className={`col-sm-12 col-md-${showMap ? 6 : 12}`}>
            <div className="detailsFieldset__details-listings">
              <p>{formattedPermit.permit_description}</p>
            </div>
            <PermitDataSubset detailsSet={'project details'} formattedPermit={formattedPermit} />
            {trcType !== undefined &&
              (<div style={{ display: 'flex' }}>
                <a style={{ marginRight: '1em' }} href="/development/major">
                  <TypePuck
                    typeObject={trcType}
                  />
                </a>
                <p><em>
                  This is a major development.  <a href="/development/major">Learn more</a> about the large-scale development process in Asheville.
                </em></p>
              </div>)
            }
          </div>
        </div>
        {/*<div className="row">
          <h2>Timeline</h2>
          <PermitTasks {...props} />
          <p>To see more details about this permit, look it up in <a href="https://services.ashevillenc.gov/CitizenAccess" target="_blank" rel="noopener noreferrer">Accela Citizen Access</a>.</p>
        </div>*/}
        <div className="col-sm-12 col-md-6">
          <h2>Zoning Details</h2>
          <PermitDataSubset detailsSet={'zoning details'} formattedPermit={formattedPermit} />
        </div>

        <div className="col-sm-12 col-md-6">
          <h2>Environmental Details</h2>
          <PermitDataSubset detailsSet={'environment details'} formattedPermit={formattedPermit} />
        </div>
      </div>);
    }}
  </Query>
);

export default Permit;
