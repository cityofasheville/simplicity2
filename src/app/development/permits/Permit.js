import React from 'react';
// import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitsMap from './PermitsMap';
import TypePuck from '../trc/TypePuck';
import { trcProjectTypes } from '../utils';
import { zoningLinks } from '../../address/zoning';

// Make query based on URL, render sub components depending on query results

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

const projectDetails = [
  {
    "Accela Label": "Permit Subtype",
    "Display Label": "Type of permit review",
    "Description": "Level of project review",
    "Examples": ""
  },
  {
    "Accela Label": "Plans Folder Location",
    "Display Label": "Plan sets and documents in review",
    "Description": "Google Drive folder link to view documents",
    "Examples": ""
  },
  {
    "Accela Label": "Subdivision Number",
    "Display Label": "Number of lots to be created",
    "Description": "Number of subdivision lots to be created",
    "Examples": ""
  },
  {
    "Accela Label": "Total Property Size",
    "Display Label": "Total property acreage",
    "Description": "",
    "Examples": ""
  },
  {
    "Accela Label": "Affordable Housing",
    "Display Label": "Affordable Housing proposed",
    "Description": "",
    "Examples": ""
  },
];

const zoningDetails = [
  {
    "Accela Label": "Zoning District",
    "Display Label": "Zoning district",
    "Description": "",
    "Examples": ""
  },
  {
    "Accela Label": "Corner Side",
    "Display Label": "Side or corner setback",
    "Description": "Minimum distance required between the side or corner property line and structures",
    "Examples": ""
  },
  {
    "Accela Label": "Front",
    "Display Label": "Front setback",
    "Description": "Minimum distance required between the front property line and structures",
    "Examples": ""
  },
  {
    "Accela Label": "Rear",
    "Display Label": "Rear Setback",
    "Description": "Minimum distance between the front property line and structures",
    "Examples": ""
  },
  {
    "Accela Label": "DTDR Overlay",
    "Display Label": "Central Business District",
    "Description": "",
    "Examples": ""
  },
  {
    "Accela Label": "HRC Overlay",
    "Display Label": "Historic district",
    "Description": "",
    "Examples": ""
  },
  {
    "Accela Label": "River District",
    "Display Label": "River District",
    "Description": "",
    "Examples": ""
  },
];

const environmentDetails = [
  {
    "Accela Label": "Aquatic Buffer",
    "Display Label": "Buffer to a natural water source on this property",
    "Description": "",
    "Examples": ""
  },
  {
    "Accela Label": "Flood Plain",
    "Display Label": "Located in the flood plain",
    "Description": "",
    "Examples": ""
  },
  {
    "Accela Label": "Percent Slope",
    "Display Label": "Average slope of the property",
    "Description": "",
    "Examples": ""
  },
  {
    "Accela Label": "Max Elevation",
    "Display Label": "Maximum elevation of the property",
    "Description": "",
    "Examples": ""
  },
  {
    "Accela Label": "Seeking LEED Certification",
    "Display Label": "Seeking LEED Certification",
    "Description": "",
    "Examples": ""
  }
];

const dateFormatter = inputDate => moment(new Date(inputDate)).format('MM/DD/YYYY');
const fieldFormatters = {
  applied_date: dateFormatter,
  status_date: dateFormatter,
  plans_folder_location: d => (<a href={d} target="_blank" rel="noopener noreferrer">Documents folder</a>),
  zoning_district: d => d.split(',').map(zone => (
    <a
      href={zoningLinks[zone]}
      target="_blank"
      rel="noopener noreferrer"
      key={zone}
    >
      {zone}
    </a>
  )),
  percent_slope: d => `${d}%`,
  max_elevation: d => `${d} feet`,
};

// TODO: RETURN NULL IF THERE ISN'T A VALUE?  OR LEAVE IT BLANK?
const PermitDataSubset = props => (
  <div className="detailsFieldset__details-listings">
    {props.detailsSet.map(d => {
      const snakeCaseAccelaLabel = d['Accela Label'].toLowerCase().split(' ').join('_');
      const val =  props.formattedPermit[snakeCaseAccelaLabel];
      if (!val) {
        return;
      }
      const formattedDisplayVal = fieldFormatters[snakeCaseAccelaLabel] ? fieldFormatters[snakeCaseAccelaLabel](val) : val;
      return (<div className="form-group form-group--has-content" key={d['Accela Label']}>
        <div className="form-group__inner">
          <div className="form-group__label" style={{ fontWeight: 'bold' }}>
            {d['Display Label']}
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
      let formattedPermit = Object.assign({}, thisPermit);
      // These are all the "misc" info fields that may or may not be filled out for any permit
      thisPermit.custom_fields.forEach((customField) => {
        formattedPermit[customField.name.toLowerCase().split(' ').join('_')] = customField.value;
      });

      // The popup is what you see when you click on the pin
      const mapData = [Object.assign(
        // TODO: USE TYPEPUCK
        {},
        thisPermit,
        {
          popup: `<b>${thisPermit.address}</b>`,
        },
      )];
      // Don't show map if there are no coordinates
      const showMap = thisPermit.y && thisPermit.x;

      let trcType = undefined;
      if (formattedPermit.permit_group === 'Planning') {
        trcType = Object.values(trcProjectTypes).find(type =>
          type.permit_type === formattedPermit.permit_type &&
          type.permit_subtype === formattedPermit.permit_subtype
        )
      }

      /* TODO:
        add little information icons where there are values for details
        move type puck into type of permit review?
        are we using fieldset and label and label for correctly on simplicity address page?  if so apply here, if not correct that and css
      */

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
            <PermitDataSubset detailsSet={projectDetails} formattedPermit={formattedPermit} />
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
          <PermitDataSubset detailsSet={zoningDetails} formattedPermit={formattedPermit} />
        </div>

        <div className="col-sm-12 col-md-6">
          <h2>Environmental Details</h2>
          <PermitDataSubset detailsSet={environmentDetails} formattedPermit={formattedPermit} />
        </div>
      </div>);
    }}
  </Query>
);

export default Permit;
