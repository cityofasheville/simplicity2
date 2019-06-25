import React from 'react';
import moment from 'moment';

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
    field: 'permit_subtype',
    display: 'Type',
    show: colWidth => colWidth > 70,
    // formatFunc: d => d.permit_subtype,
  },
  {
    field: 'status_current',
    display: 'Status',
    show: colWidth => colWidth > 90,
  },
  {
    field: 'application_name',
    display: 'Project',
    show: colWidth => colWidth > 90,
  },
  {
    field: 'permit_number',
    display: 'Record Link',
    formatFunc: d => <a href={`/permits/${d.permit_number}`}>{d.permit_number}</a>,
  },
];

export const descriptorTitles = {
  whyLevel: 'What makes this project fit in this category?',
  recentAppsLink: 'See recently submitted projects of this type',
  participationOpp: 'Opportunities for public participation',
  examples: 'Examples of this type of project',
  ordinanceLink: 'Link to the ordinance that defines this type of development',
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
    description: 'Projects smaller than 35,000 square feet or with fewer than 20 residential units that trigger zoning compliance requirements.',
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
    description: 'Any project that requires the extension or creation of a new public or private street.  Typically these projects create new residential lots.',
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
    description: 'In most zoning districts, commercial projects between 35,000 and 99,9999 square feet, residential projects between 20 and 49 dwelling units and industrial projects with a floor area greater than 100,000 square feet.  Different restrictions apply in the River Zoning District or Downtown.',
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
    description: 'Any development project that seeks to change the zoning of a site and develop the site simultaneously.',
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
    description: <div>Anything that is listed as a conditional use in <a href="https:/library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTXVIUSRISUSPRECOUS_S7-16-2COUS" target="_blank" rel="noopener noreferrer">Section 7-16-2 of the Unified Development Ordinance.</a></div>,
    descriptors: {
      whyLevel: "A highly specialized permit process for land uses with potential public impacts that require individual consideration of their location, design, configuration and operation.  These uses are defined by the code",
      participationOpp: (<ul><li>Neighborhood meeting</li><li>Design review (if downtown or on the river)</li><li>Planning and Zoning Commission</li><li>City Council hearing</li></ul>),
      examples: (<ul>
        <li>Cell phone towers</li>
        <li>Jails</li>
        <li>Government buildings</li>
        <li>Group homes</li>
      </ul>),
      recentAppsLink: <a href="/development/major?permit_subtype=level%20II%20#data">Recently submitted Conditional Use projects</a>,
    },
    color: '#073d49',
  };
}
