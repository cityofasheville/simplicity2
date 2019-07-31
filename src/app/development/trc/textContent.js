import React from 'react';
import Icon from '../../../shared/Icon';
import FlowDiagram from './FlowDiagram';
import TRCDataTable from './TRCDataTable';
import Accordion from '../../../shared/Accordion';
import PermitTypeCards from './PermitTypeCards';
import CityLogoSvg from '../../../shared/CityLogoSvg';
import {
  DRAFTING_COMPASS,
  USER_FRIENDS,
  GAVEL,
} from '../../../shared/iconConstants';

export const faqs = [
  {
    header: 'How current is this data?',
    body: 'Data in SimpliCity is updated nightly.',
  },
  {
    header: 'Where is the Development Services Department?',
    body: (<React.Fragment><a href="https://goo.gl/maps/sKweCmhK4iiEuz7t6" target="_blank" rel="noopener noreferrer">161 South Charlotte Street</a>, down the hill from City Hall.</React.Fragment>),
  },
  {
    header: 'Where is City Hall?',
    body: (<React.Fragment><a href="https://goo.gl/maps/FWoy1aRrV1ktdF8T7" target="_blank" rel="noopener noreferrer">70 Court Plaza</a>, off of College Street.</React.Fragment>),
  },
  {
    header: 'Who builds these projects?',
    body: 'Small business owners, land owners, developers, and other private investors submit applications for permission to develop property in the city.  Once approved, they work with private contractors.',
  },
  {
    header: 'Who should I talk to if I have questions about one of these projects?',
    body: 'Give our Planner of the Day a call at 828-259-5450 or email them at pod@ashevillenc.gov.  They will direct you to the city planner who is reviewing the application.',
  },
  {
    header: 'How can I tell if a project includes affordable housing?',
    body: 'If the developer has indicated that they are planning to include affordable housing, it will be indicated on the project page with an icon.  Throughout the process, a developer could alter their plans, and this may not be reflected on the project page immediately.',
  },
  {
    header: 'How can I join one of the commissions that reviews projects?',
    body: <React.Fragment>Visit <a href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/" target="_blank" rel="noopener noreferrer">the Boards and Commissions web page</a> to view current vacancies and learn about application steps.</React.Fragment>,
  },
  {
    header: 'I still have a question!',
    body: (
      <React.Fragment>
        <p>If your question was not answered here, please <a href="https://forms.gle/CkkihZfs37opZfXM8" target="_blank" rel="noopener noreferrer">let us know what it was</a> so that we can improve this page.  If you have a question to which you need a response, please email pod@ashevillenc.gov instead.</p>
        <p>If you have thoughts about to improve this tool, please <a href="https://forms.gle/kSRTZidJUtNdZ8Rz7" rel="noopener noreferrer" target="_blank">tell us</a>.</p>
      </React.Fragment>
    ),
  },
  // {
  //   header: 'How much control does the City have over the look and feel of a project?',
  //   body: 'Some review levels or zoning districts allow the City to review architectural design and some do not.  For instance, projects downtown, in historic districts, or in the river design area are subject to certain architectural requirements.  Conditional zoning projects allow Council the authority and flexibility to mandate some design elements.  Most projects outside of these cases do not allow for much flexibility in regulating architectural design.',
  // },
];

export const devDashSections = [
  {
    linkId: 'types',
    linkName: 'Project Types',
    header: 'Types of large-scale development',
    body: (<React.Fragment>
      <p>The types of large-scale development are defined by <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVDEREPR_S7-5-9SIPLREDEPREXTHPAZOCEBUDILODODEREOVDICBDD" target="_blank" rel="noopener noreferrer">the City of Asheville's Unified Development Ordinance.</a>  Projects located downtown are <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVDEREPR_S7-5-9.1DEAPPRPAZOCEBUDILODODEREOVDICBDD" target="_blank" rel="noopener noreferrer">defined slightly differently in the ordinance.</a></p>
      <PermitTypeCards />
    </React.Fragment>),
  },
  {
    linkId: 'process',
    linkName: 'Process',
    header: 'The development process',
    body: (<React.Fragment>
      <p>After the developer submits an application, it goes through a decision-making process that includes city staff, elected and appointed city officials, developers, and residents.  Who is involved at what step depends on the type of project.</p>
      <FlowDiagram />
    </React.Fragment>),
  },
  {
    linkId: 'notifications',
    linkName: 'Get Notifications',
    header: 'Sign up for notifications',
    body: (<p>The City of Asheville will be piloting a new notification system that allows people to sign up for non-emergency alerts based on city data.  Stay tuned for the launch of this tool!</p>),
  },
  {
    linkId: 'data',
    linkName: 'Project Details',
    header: 'Development details',
    body: (<React.Fragment>
      <p>The map and table below contain proposed, large-scale, private development projects for which a permit application has been submitted.  You can also see a <a href="/permits">table of all permit applications</a> or <a href="/">search an address</a> to find nearby development.  Visit <a href="https://www.google.com/maps/d/u/0/viewer?mid=1gTdFgMITqbYX7cm3L227CiClMzg&ll=35.54416648021354%2C-82.55690042880553&z=10" target="_blank" rel="noopener noreferrer">the old TRC projects map</a> to see projects that were started more than two years ago.</p>
      <TRCDataTable />
    </React.Fragment>),
  },
  {
    linkId: 'calendar',
    linkName: 'Neighborhood Meetings',
    header: 'Upcoming neighborhood meetings',
    body: (<React.Fragment>
        <p>Developers planning to submit applications for development that must go through the Technical Review Committee must hold a public meeting before submitting the application.</p>
        <p>Currently, developers are not required by law to notify the City of Asheville when those meetings take place.  Thus, the first record the city has of a proposed development is when the application is submitted, after the meeting.</p>
        <p>However, in order to help ensure that residents can find out about neighborhood meetings in advance, the city has asked developers to voluntarily notify the city.  After those developers fill out an online form, those meeting dates are automatically added to <a target="_blank" rel="noopener noreferrer" href="https://calendar.google.com/calendar/embed?src=ashevillenc.gov_gk5l650n9mopts9m7sfemhcpd8%40group.calendar.google.com&ctz=America%2FNew_York">a calendar that shows all neighborhood meetings about which the city has been notified</a>.</p>
    </React.Fragment>)
  },
  {
    linkId: 'faq',
    linkName: 'Frequently Asked Questions',
    header: 'Frequently asked questions',
    body: (<Accordion
      data={faqs}
    />),
  },
];

export const orderedDates = [
  {
    accelaLabel: 'Pre-App Date',
    displayLabel: 'Pre-application meeting',
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

export const descriptorTitles = {
  whyLevel: 'What makes a project fit in this category?',
  recentAppsLink: '',
  participationOpp: 'Opportunities for public participation',
  examples: 'Examples',
};

export const trcProjectTypes = {};
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
    recentAppsLink: <a href="/development/major?permit_type=level%20I%20#data">Recently submitted Level I projects</a>,
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
    recentAppsLink: <a href="/development/major?permit_type=Major%20Subdivision#data">Recently submitted Major Subdivision projects</a>,
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
    recentAppsLink: <a href="/development/major?permit_type=level%20II%20#data">Recently submitted Level II projects</a>,
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
    recentAppsLink: <a href="/development/major?permit_type=Conditional%20Zoning#data">Recently submitted Conditional Zoning projects</a>,
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
    recentAppsLink: <a href="/development/major?permit_type=conditional%20use%20#data">Recently submitted Conditional Use projects</a>,
  },
  color: '#073d49',
};

export const whoIcons = {
  dev: {
    label: 'Developer',
    icon: (<Icon path={DRAFTING_COMPASS} viewBox="0 0 512 512" />),
  },
  staff: {
    label: 'City Staff',
    icon: (<CityLogoSvg color="black" height={16} />),
  },
  council: {
    label: 'City Officials',
    icon: (<Icon path={GAVEL} viewBox="0 0 512 512" />),
  },
  neighbors: {
    label: 'Neighbors',
    icon: (<Icon path={USER_FRIENDS} viewBox="0 0 640 512" size={19} />),
  },
};

export const decisionIconHeader = (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div>
      <div>
        <svg height="16px" width="16px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-check fa-w-16 fa-2x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
        <span style={{ margin: '0 0 0 1rem' }}>Approved</span>
      </div>
      <div>
        <svg height="16px" width="16px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="svg-inline--fa fa-times fa-w-11 fa-2x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg>
        <span style={{ margin: '0 0 0 1rem' }}>Denied</span>
      </div>
      <div>
        <svg height="16px" width="16px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-redo fa-w-16 fa-2x"><path fill="currentColor" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z" className=""></path></svg>
        <span style={{ margin: '0 0 0 1rem' }}>Revise</span>
      </div>
    </div>
  </div>
);

const decisionNodeMaxWidth = 400;
export const dagreNodes = [
  {
    id: 'Before the application is submitted',
    subNodes: [
      {
        id: 'Pre-application meeting',
        steps: {
          what: 'Developers and city staff meet to look at initial sketches, discuss process and schedule, and identify applicable regulations.',
          who: ['dev', 'staff'],
          when: 'Required before application submission',
          where: <a href="https://goo.gl/maps/FYcn1ATUY7Ux8q6G9" target="_blank" rel="noopener noreferrer">Development Services Department offices</a>,
        },
      },
      {
        id: 'Neighborhood meeting',
        steps: {
          what: 'Developers must notify all property owners within 200 feet of the proposed development site.  Neighbors meet with developers to collaborate on neighborhood needs and opportunities.',
          who: ['dev', 'neighbors'],
          when: <React.Fragment>Ten days before application submission (<a href="/development/major#calendar">see calendar</a>)</React.Fragment>,
          where: 'Somewhere near the proposed development site, specified in the notice',
        },
      },
    ],
    typeIds: [
      'Level II',
      'Major Subdivision',
      'Conditional Zoning',
      'Conditional Use Permit',
    ],
  },
  {
    id: 'Permit application',
    steps: {
      what: <React.Fragment>Submission of required plans and documents and payment of application fees to the <a href="https://www.ashevillenc.gov/department/development-services/" rel="noopener noreferrer" target="_blank">Development Services Department</a>.</React.Fragment>,
      who: ['dev'],
      when: 'After all required preliminary steps are completed.',
      where: <a href="https://goo.gl/maps/FYcn1ATUY7Ux8q6G9" target="_blank" rel="noopener noreferrer">Development Services Department offices</a>,
    },
    typeIds: [
      'Level I',
      'Level II',
      'Major Subdivision',
      'Conditional Zoning',
      'Conditional Use Permit',
    ],
  },
  {
    id: 'Staff review',
    steps: {
      what: 'A staff member reviews plans for compliance with applicable ordinances and documents and creates a report.',
      who: ['staff'],
      when: 'Within ten days of application submittal',
      where: <a href="https://goo.gl/maps/FYcn1ATUY7Ux8q6G9" target="_blank" rel="noopener noreferrer">Development Services Department offices</a>,
    },
    typeIds: [
      'Level I',
    ],
  },
  {
    id: 'Level I decision',
    decisionNode: true,
    typeIds: [
      'Level I',
    ],
    maxWidth: decisionNodeMaxWidth,
  },
  {
    id: 'Technical Review Committee',
    steps: {
      what: <React.Fragment>An eight-member body that ensures that the proposed project complies with standards and requirements.  Meeting agendas are available on <a href="https://www.ashevillenc.gov/department/city-clerk/boards-and-commissions/technical-review-committee/" target="_blank" rel="noopener noreferrer">the city website</a>.</React.Fragment>,
      who: ['dev', 'staff'],
      when: 'First and third Monday of each month',
      where: <a href="https://goo.gl/maps/FYcn1ATUY7Ux8q6G9" target="_blank" rel="noopener noreferrer">Development Services Department offices</a>,
    },
    typeIds: [
      'Level II',
      'Major Subdivision',
      'Conditional Zoning',
      'Conditional Use Permit',
    ],
  },
  {
    id: 'Major Subdivision and Level II decision (not downtown)',
    decisionNode: true,
    typeIds: [
      'Level II',
      'Major Subdivision',
    ],
    maxWidth: decisionNodeMaxWidth,
  },
  {
    id: 'Design review',
    steps: {
      what: <div>Projects located Downtown or in the River District must be reviewed for architectural design elements by a special design review sub-committee of either the <a href="https://www.ashevillenc.gov/department/city-clerk/boards-and-commissions/downtown-commission/" target="_blank" rel="noopener noreferrer">Asheville Downtown Commission</a> or the <a href="https://www.ashevillenc.gov/department/city-clerk/boards-and-commissions/asheville-area-riverfront-redevelopment-commission/" target="_blank" rel="noopener noreferrer">Asheville Area Riverfront Redevelopment Commission</a> prior to approval.</div>,
      who: ['dev', 'staff', 'neighbors'],
      when: (<ul style={{ padding: 0 }}>
        <li>Downtown Commission: second Friday of each month</li>
        <li>Riverfront Commission: second Thursday of each month</li>
      </ul>),
      where: (<ul style={{ padding: 0 }}>
        <li>Downtown Commission: <a href="https://goo.gl/maps/7GkCkb1pPjRaXbAc7" target="_blank" rel="noopener noreferrer">City Hall</a></li>
        <li>Riverfront Commission: <a href="https://goo.gl/maps/Wbamfs7tbhSmQ1Uz7" target="_blank" rel="noopener noreferrer">Explore Asheville offices</a></li>
      </ul>),
    },
    typeIds: [
      'Level II',
      'Major Subdivision',
    ],
  },
  {
    id: 'Major Subdivision decision (downtown)',
    decisionNode: true,
    typeIds: [
      'Major Subdivision',
    ],
    maxWidth: decisionNodeMaxWidth,
  },
  {
    id: 'Planning and Zoning Commission',
    steps: {
      what: <React.Fragment>For  Conditional Zoning, Conditional Use, and Level III projects, the <a href="https://www.ashevillenc.gov/department/city-clerk/boards-and-commissions/planning-and-zoning-commission/" target="_blank" rel="noopener noreferrer">Planning and Zoning Commission</a> holds a public hearing and makes a recommendation for action to City Council.  For downtown Level II projects, the Planning and Zoning Commission verifies technical compliance with the requirements of applicable ordinances and documents and takes final action.</React.Fragment>,
      who: ['dev', 'staff', 'neighbors', 'council'],
      when: (<React.Fragment>Per <a href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/planning-and-zoning-commission/">published schedule</a></React.Fragment>),
      where: <a href="https://goo.gl/maps/7GkCkb1pPjRaXbAc7" target="_blank" rel="noopener noreferrer">City Hall</a>,
    },
    typeIds: [
      'Level II',
      'Conditional Zoning',
      'Conditional Use Permit',
    ],
  },
  {
    id: 'Level II decision (downtown)',
    decisionNode: true,
    typeIds: [
      'Level II',
    ],
    maxWidth: decisionNodeMaxWidth,
  },
  {
    id: 'City Council',
    steps: {
      what: <React.Fragment>Applications are reviewed during a public hearing before <a href="https://www.ashevillenc.gov/government/meet-city-council/" target="_blank" rel="noopener noreferrer">City Council</a>.  These projects arrive at the City Council meeting with a recommendation for action that has been sent by the Planning and Zoning Commission.</React.Fragment>,
      who: ['dev', 'staff', 'neighbors', 'council'],
      when: 'The second and fourth Tuesday of each month',
      where: <a href="https://goo.gl/maps/7GkCkb1pPjRaXbAc7" target="_blank" rel="noopener noreferrer">City Hall</a>,
    },
    typeIds: [
      'Conditional Zoning',
      'Conditional Use Permit',
    ],
  },
  {
    id: 'City Council decision',
    decisionNode: true,
    typeIds: [
      'Conditional Zoning',
      'Conditional Use Permit',
    ],
    maxWidth: decisionNodeMaxWidth,
  },
];

export const dagreLinks = [
  {
    source: 'Before the application is submitted',
    target: 'Permit application',
    parallelEdges: [
      { id: 'Major Subdivision' },
      { id: 'Level II' },
      { id: 'Conditional Zoning' },
      { id: 'Conditional Use Permit' },
    ],
  },
  {
    source: 'Permit application',
    target: 'Staff review',
    parallelEdges: [
      { id: 'Level I' },
    ],
  },
  {
    source: 'Permit application',
    target: 'Technical Review Committee',
    parallelEdges: [
      { id: 'Major Subdivision' },
      { id: 'Level II' },
      { id: 'Conditional Zoning' },
      { id: 'Conditional Use Permit' },
    ],
  },
  {
    source: 'Staff review',
    target: 'Level I decision',
    id: 'Level I',
  },
  {
    source: 'Technical Review Committee',
    target: 'Major Subdivision and Level II decision (not downtown)',
    parallelEdges: [
      { id: 'Major Subdivision' },
      { id: 'Level II' },
    ],
  },
  {
    source: 'Design review',
    target: 'Planning and Zoning Commission',
    parallelEdges: [
      { id: 'Level II' },
    ],
  },
  {
    source: 'Design review',
    target: 'Major Subdivision decision (downtown)',
    parallelEdges: [
      { id: 'Major Subdivision' },
    ],
  },
  {
    source: 'Technical Review Committee',
    target: 'Design review',
    parallelEdges: [
      { id: 'Level II' },
      { id: 'Major Subdivision' },
    ],
  },
  {
    source: 'Technical Review Committee',
    target: 'Planning and Zoning Commission',
    parallelEdges: [
      { id: 'Conditional Zoning' },
      { id: 'Conditional Use Permit' },
    ],
  },
  {
    source: 'Planning and Zoning Commission',
    target: 'Level II decision (downtown)',
    parallelEdges: [
      { id: 'Level II' },
    ],
  },
  {
    source: 'Planning and Zoning Commission',
    target: 'City Council',
    parallelEdges: [
      { id: 'Conditional Zoning' },
      { id: 'Conditional Use Permit' },
    ],
  },
  {
    source: 'City Council',
    target: 'City Council decision',
    parallelEdges: [
      { id: 'Conditional Zoning' },
      { id: 'Conditional Use Permit' },
    ],
  },
];
