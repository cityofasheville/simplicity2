import React from 'react';
import moment from 'moment';
import TypePuck from './trc/TypePuck';

// For TRC projects only
export const orderedDates = [
  {
    accelaLabel: 'Pre-App Date',
    displayLabel: 'Pre-application meeting'
  },
  {
    accelaLabel: 'Neighborhood Meeting Date',
    displayLabel: 'Neighborhood meeting',
  },
  {
    accelaLabel: 'applied_date',
    displayLabel: 'Application accepted by staff',
  },
  {
    accelaLabel: 'Initial TRC Date 1',
    displayLabel: 'Technical review committee meeting',
  },
  {
    accelaLabel: 'Initial TRC Date 2',
    displayLabel: 'Technical review committee meeting (revised materials)',
  },
  {
    accelaLabel: 'Initial TRC Date 3',
    displayLabel: 'Technical review committee meeting (revised materials)',
  },
  {
    accelaLabel: 'DTC Date 1',
    displayLabel: 'Downtown Commission meeting',
  },
  {
    accelaLabel: 'DTC Date 2',
    displayLabel: 'Downtown Commission meeting (revised materials)',
  },
  {
    accelaLabel: 'PZC Date 1',
    displayLabel: 'Planning and Zoning commission meeting',
  },
  {
    accelaLabel: 'PZC Date 2',
    displayLabel: 'Planning and Zoning commission meeting (revised materials)',
  },
  {
    accelaLabel: 'Final TRC Date 1',
    displayLabel: 'Technical review committee meeting (revised materials)',
  },
  {
    accelaLabel: 'Final TRC Date 2',
    displayLabel: 'Technical review committee meeting (revised materials)',
  },
  {
    accelaLabel: 'City Council Date 1',
    displayLabel: 'City Council meeting',
  },
  {
    accelaLabel: 'City Council Date 2',
    displayLabel: 'City Council meeting (revised materials)',
  },
];

export const statusTranslation = [
  {
    accelaSpeak: "Application Submitted",
    statusText: "The applicant has submitted an application to the City, but we haven't started reviewing it yet.",
  },
  {
    accelaSpeak: "Application Received",
    statusText: "The applicant has submitted an application to the City, but we haven't started reviewing it yet.",
  },
  {
    accelaSpeak: "CC Issued",
    statusText: "",
  },
  {
    accelaSpeak: "City Council Review",
    statusText: "The Planning & Zoning Commission has completed review of the project and the next step is a public hearing before City Council.",
  },
  {
    accelaSpeak: "Closed",
    statusText: "",
  },
  {
    accelaSpeak: "CO Issued",
    statusText: "This project is complete and has been approved for occupancy.",
  },
  {
    accelaSpeak: "Expired",
    statusText: "This project was approved, but too much time has passed since that approval and the approval has now expired.",
  },
  {
    accelaSpeak: "Finaled",
    statusText: "This project is complete and has been approved for occupancy.",
  },
  {
    accelaSpeak: "Issued",
    statusText: "This project has been approved and the City has issued permits to begin construction.",
  },
  {
    accelaSpeak: "Master Plan Approved",
    statusText: "City Council has approved this project. The next step is for the developer to submit detailed applications for development permits.",
  },
  {
    accelaSpeak: "Partial Issued",
    statusText: "Some permits have been issued by the City for this project.",
  },
  {
    accelaSpeak: "Pending Applicant Action",
    statusText: "The City has asked the applicant for more information and is waiting for the applicant to submit.",
  },
  {
    accelaSpeak: "Plan Check",
    statusText: "City staff is reviewing this plan for compliance with local, state, and/or federal standards.",
  },
  {
    accelaSpeak: "Pre-Application Complete",
    statusText: "",
  },
  {
    accelaSpeak: "Pre-Application Received",
    statusText: "",
  },
  {
    accelaSpeak: "Reissued",
    statusText: "This project has been approved and the City has issued permits to begin construction.",
  },
  {
    accelaSpeak: "Revision in Review",
    statusText: "The applicant has submitted new plans and City staff is reviewing those plans.",
  },
  {
    accelaSpeak: "Revoked",
    statusText: "",
  },
  {
    accelaSpeak: "TCC Issued",
    statusText: "This project has been approved for occupancy.",
  },
  {
    accelaSpeak: "TCO Issued",
    statusText: "This project has been approved for occupancy.",
  },
  {
    accelaSpeak: "TRC Review",
    statusText: "City staff is reviewing this plan for compliance with local, state, and/or federal standards.",
  },
  {
    accelaSpeak: "Under Review",
    statusText: "City staff is reviewing this plan for compliance with local, state, and/or federal standards.",
  },
  {
    accelaSpeak: "Withdrawn",
    statusText: "The applicant has asked the City to stop reviewing this project.",
  }
]

export const defaultTableHeaders = [
  {
    field: 'applied_date',
    display: 'Date Applied',
    formatFunc: d => moment.utc(new Date(d.applied_date)).format('MMM DD, YYYY'),
  },
  {
    field: 'address',
    display: 'Address',
  },
  {
    field: 'permit_type',
    display: 'Type',
    formatFunc: d => {
      const trcType = getTRCTypeFromPermit(d);
      if (!trcType) {
        let returnString = d.permit_type;
        if (d.permit_subtype !== 'NA') {
          returnString += `: ${d.permit_subtype}`;
        }
        if (d.permit_category !== 'NA') {
          returnString += `: ${d.permit_category}`;
        }
        return returnString;
      }
      return (<div>
        <span style={{ marginRight: '1em' }}>{trcType.id}</span>
        <div style={{ verticalAlign: 'middle', display: 'inline-block', float: 'right' }}>
          <TypePuck
            typeObject={trcType}
            size={30}
            hover={false}
          />
        </div>
      </div>);
    },
  },
  {
    field: 'status_current',
    display: 'Status',
  },
  {
    field: 'application_name',
    display: 'Project',
  },
  {
    field: 'permit_number',
    display: 'Record Link',
    formatFunc: d => <a href={`/permits/${d.permit_number}`}>{d.permit_number}</a>,
  },
];

export const descriptorTitles = {
  whyLevel: 'What makes a project fit in this category?',
  recentAppsLink: '',
  participationOpp: 'Opportunities for public participation',
  examples: 'Examples',
};

// Assign colors to project types
// const orderedColors = [
//   '#FF3A3A',
//   '#749B5F',
//   '#2d93ad',
//   '#004EA3',
//   '#9B6681',
//   '#9E4F55',
//   '#073d49',
// ];
export const trcProjectTypes = {};
{
  trcProjectTypes['Level I'] = {
    id: 'Level I',
    permit_group: 'Planning',
    permit_type: 'Development',
    permit_subtype: 'Level I',
    short: 'I',
    descriptors: {
      whyLevel: (<ul>
        <li>Not located downtown and contains 3 to 19 residential units or 500 to 34,999 square feet of commercial space</li>
        <li>Located downtown and is 500 to 19,999 square feet</li>
      </ul>),
      participationOpp: 'There are no public participation opportunities for Level I projects.',
      examples: (<ul>
        <li>A new restaurant</li>
        <li>A new pharmacy</li>
        <li>A 15-unit apartment building</li>
      </ul>),
      recentAppsLink: <a href="/development/major?permit_subtype=level%20I%20#data">Recently submitted Level I projects</a>,
    },
    color: '#FF3A3A',
  };
  trcProjectTypes['Major Subdivision'] = {
    id: 'Major Subdivision',
    permit_group: 'Planning',
    permit_type: 'Subdivision',
    permit_subtype: 'Major',
    short: 'MS',
    descriptors: {
      whyLevel: (<ul>
        <li>Creation or extension of a road</li>
        <li>Usually creates new residential lots</li>
      </ul>),
      participationOpp: (<ul><li>Neighborhood meeting</li></ul>),
      examples: (<ul>
        <li>A new neighborhood with a new road created</li>
      </ul>),
      recentAppsLink: <a href="/development/major?permit_subtype=Major%20Subdivision#data">Recently submitted Major Subdivision projects</a>,
    },
    color: '#749B5F',
  };
  trcProjectTypes['Level II'] = {
    id: 'Level II',
    permit_group: 'Planning',
    permit_type: 'Development',
    permit_subtype: 'Level II',
    short: 'II',
    descriptors: {
      whyLevel: (<ul>
        <li>Not located downtown and contains 20 to 49 residential units or is 35,000 to 99,999 square feet</li>
        <li>Located downtown and is 20,000 to 99,999 square feet</li>
      </ul>),
      participationOpp: (<ul>
        <li>Downtown:
          <ul><li>Neighborhood meeting</li><li>Design review</li><li>Planning and Zoning Commission</li></ul>
        </li>
        <li>Not downtown:
          <ul><li>Neighborhood meeting</li><li>Design review (if on the river)</li></ul>
        </li>
        </ul>),
      examples: (<ul>
        <li>A new grocery store</li>
        <li>A big box specialty retailer</li>
        <li>A medium-sized apartment complex</li>
      </ul>),
      recentAppsLink: <a href="/development/major?permit_subtype=level%20II%20#data">Recently submitted Level II projects</a>,
    },
    color: '#2d93ad',
  };
  trcProjectTypes['Conditional Zoning'] = {
    id: 'Conditional Zoning',
    permit_group: 'Planning',
    permit_type: 'Development',
    permit_subtype: 'Conditional Zoning',
    short: 'CZ',
    descriptors: {
      whyLevel: (<ul>
        <li>Requires a change in zoning</li>
        <li>50 or more residential units</li>
        <li>99,999 square feet or larger</li>
        <li>Includes all projects previously designated as Level III</li>
      </ul>),
      participationOpp: (<ul><li>Neighborhood meeting</li><li>Design review (if downtown or on the river)</li><li>Planning and Zoning Commission</li><li>City Council hearing</li></ul>),
      examples: (<ul>
        <li>A large apartment complex</li>
        <li>A large office building</li>
        <li>A large department store</li>
      </ul>),
      recentAppsLink: <a href="/development/major?permit_subtype=Conditional%20Zoning#data">Recently submitted Conditional Zoning projects</a>,
    },
    color: '#9B6681',
  };
  trcProjectTypes['Conditional Use Permit'] = {
    id: 'Conditional Use Permit',
    permit_group: 'Planning',
    permit_type: 'Development',
    permit_subtype: 'Conditional Use',
    short: 'CUP',
    descriptors: {
      whyLevel: <React.Fragment>This is highly specialized permit process for land uses with potential public impacts that require individual consideration of their location, design, configuration and operation.  These uses are defined by <a href="https:/library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTXVIUSRISUSPRECOUS_S7-16-2COUS" target="_blank" rel="noopener noreferrer">Section 7-16-2 of the Unified Development Ordinance</a>.</React.Fragment>,
      participationOpp: (<ul><li>Neighborhood meeting</li><li>Design review (if downtown or on the river)</li><li>Planning and Zoning Commission</li><li>City Council hearing</li></ul>),
      examples: (<ul>
        <li>Cell phone towers</li>
        <li>Jails</li>
        <li>Government buildings</li>
        <li>Group homes</li>
      </ul>),
      recentAppsLink: <a href="/development/major?permit_subtype=conditional%20use%20#data">Recently submitted Conditional Use projects</a>,
    },
    color: '#073d49',
  };
}

export const getTRCTypeFromPermit = (permit) => {
  if (permit.permit_group === 'Planning') {
    return Object.values(trcProjectTypes).find(type =>
      type.permit_type === permit.permit_type &&
      type.permit_subtype === permit.permit_subtype);
  }
  return null;
}
