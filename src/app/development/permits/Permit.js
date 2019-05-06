import React from 'react';
// import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitsMap from './PermitsMap';
import TypePuck from '../trc/TypePuck';
import { trcProjectTypes } from '../utils';

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
      total_project_valuation
      total_sq_feet
      civic_address_id
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

const projectDetails = [
  {
    "Accela Label": "Permit Subtype",
    "Display Label": "Type of permit review",
    "Description": "Level of project review",
    "Examples": ""
  },
  {
    "Accela Label": "Application Name",
    "Display Label": "Project name",
    "Description": "Name of project",
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

// TODO: RETURN NULL IF THERE ISN'T A VALUE?  OR LEAVE IT BLANK?
const DtSet = props => (
  <div className="DtSet">
    <dt
      className="text-left text-capitalize"
    >
      {props.label}:
    </dt>
    <dd>
      {props.value}
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
        // TODO: USE TYPEPUCK
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
        status_current: {
          keyFormatter: () => 'Review Status',
        },
        contractor_names: {
          valueFormatter: namesArray => Object.values(namesArray).join(', '),
        },
        Pinnumber: {
          keyFormatter: () => 'Pin Number',
          valueFormatter: pin => (
            <a
              href={`/property?search=${pin}&id=${pin}&entities=undefined&entity=property`}
            >
              {pin}
            </a>
          ),
        },
      };

      const h1Title = formattedPermit.application_name;
      let trcType = undefined;
      if (formattedPermit.permit_group === 'Planning') {
        trcType = Object.values(trcProjectTypes).find(type =>
          type.permit_type === formattedPermit.permit_type &&
          type.permit_subtype === formattedPermit.permit_subtype
        )
      }

      return (<div className="container">
        <div className="row">
          <h1 className="title__text">{h1Title}</h1>
          {showMap && (<div className="col-sm-12 col-md-6">
            <div className="map-container" style={{ height: `${projectDetails.length * 4}em` }}>
              <PermitsMap
                permitData={mapData}
                centerCoords={[formattedPermit.y, formattedPermit.x]}
                zoom={14}
              />
            </div>
          </div>)}
          <div className={`col-sm-12 col-md-${showMap ? 6 : 12}`}>
            <h2>Overview</h2>
            <dl className="dl-horizontal summary-group">
              {projectDetails.map(d => (<DtSet
                key={d['Display Label']}
                label={d['Display Label']}
                value={formattedPermit[d['Accela Label'].toLowerCase().split(' ').join('_')]}
              />))}
            </dl>
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
        <div className="row">
          <h2>Details</h2>
          <dl className="dl-horizontal col-sm-12 col-md-6">
            {zoningDetails.map(d => (<DtSet
              key={d['Display Label']}
              label={d['Display Label']}
              value={formattedPermit[d['Accela Label'].toLowerCase().split(' ').join('_')]}
            />))}
          </dl>
          <dl className="dl-horizontal col-sm-12 col-md-6">
            {environmentDetails.map(d => (<DtSet
              key={d['Display Label']}
              label={d['Display Label']}
              value={formattedPermit[d['Accela Label'].toLowerCase().split(' ').join('_')]}
            />))}
          </dl>
        </div>
      </div>);
    }}
  </Query>
);

export default Permit;
