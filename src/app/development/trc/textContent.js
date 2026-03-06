import React from 'react';
import Icon from '../../../shared/Icon';
import PermitTypeCards from './PermitTypeCards';
import CityLogoSvg from '../../../shared/CityLogoSvg';
import { DRAFTING_COMPASS, USER_FRIENDS, GAVEL } from '../../../shared/iconConstants';

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
    whyLevel: (
      <ul className="list-disc ml-6">
        <li>
          Not located downtown and contains 5 to 19 residential units or 500 to 34,999 square feet
          of commercial space
        </li>
        <li>Located downtown and is 500 to 19,999 square feet</li>
      </ul>
    ),
    participationOpp: 'There are no public participation opportunities for Level I projects.',
    examples: (
      <ul className="list-disc ml-6">
        <li>A new restaurant</li>
        <li>A new pharmacy</li>
        <li>A 15-unit apartment building</li>
      </ul>
    ),
    // recentAppsLink: (
    //   <a href="/development/major?permit_type=level%20I%20#data">
    //     Recently submitted Level I projects
    //   </a>
    // ),
  },
  color: '#FF3A3A',
  tw: 'bg-[#FF3A3A] text-white',
};
trcProjectTypes['Major Subdivision'] = {
  id: 'Major Subdivision',
  permit_group: 'Planning',
  permit_type: 'Subdivision',
  permit_subtype: 'Major',
  short: 'MS',
  descriptors: {
    whyLevel: (
      <ul className="list-disc ml-6">
        <li>Creation or extension of a road</li>
        <li>Usually creates new residential lots</li>
      </ul>
    ),
    participationOpp: (
      <ul className="list-disc ml-6">
        <li>
          <a href="/development/major/engage">Neighborhood meeting</a>
        </li>
        <li>
          <a
            href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/historic-resources-commission/"
            rel="noreferrer"
          >
            Historic Resources Commission meeting{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          (if in{' '}
          <a
            href="https://ashevillenc.gov/department/planning-urban-design/historic-resources/historic-district-guidelines/"
            rel="noreferrer"
          >
            a historic district{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          or concerning a{' '}
          <a
            href="https://ashevillenc.gov/department/planning-urban-design/historic-resources/landmarks/"
            rel="noreferrer"
          >
            historic landmark{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          )
        </li>
      </ul>
    ),
    examples: (
      <ul className="list-disc ml-6">
        <li>A new neighborhood with a new road created</li>
      </ul>
    ),
    // recentAppsLink: (
    //   <a href="/development/major?permit_type=Major%20Subdivision#data">
    //     Recently submitted Major Subdivision projects
    //   </a>
    // ),
  },
  color: '#5B7B4C',
  tw: 'bg-[#5B7B4C] text-white',
};
trcProjectTypes['Level II'] = {
  id: 'Level II',
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Level II',
  short: 'II',
  descriptors: {
    whyLevel: (
      <ul className="list-disc ml-6">
        <li>
          Generally, residential developments between 19-49 unit or commerical developments between
          35,000 and 99,999 square feet
        </li>
        <li>
          Incentives for affordable housing change the review level for certain projects that may
          lie outside of these thresholds
        </li>
        <li>
          <a
            href="https://codelibrary.amlegal.com/codes/ashevillenc/latest/asheville_nc/0-0-0-4236"
            rel="noreferrer"
          >
            Section 7-5-9 of the UDO{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          has more information on Level II thresholds and incentives
        </li>
      </ul>
    ),
    participationOpp: (
      <ul className="list-disc ml-6">
        <li>
          Downtown:
          <ul className="list-disc ml-6">
            <li>
              <a href="/development/major/engage">Neighborhood meeting</a>
            </li>
            <li>Design review</li>
            <li>
              <a
                href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/planning-and-zoning-commission/"
                rel="noreferrer"
              >
                Planning and Zoning Commission{' '}
                <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
                <span className="sr-only">(external site)</span>
              </a>
            </li>
          </ul>
        </li>
        <li>
          Not downtown:
          <ul className="list-disc ml-6">
            <li>
              <a href="/development/major/engage">Neighborhood meeting</a>
            </li>
            <li>Design review (if on the river)</li>
          </ul>
        </li>
        <li>
          <a
            href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/historic-resources-commission/"
            rel="noreferrer"
          >
            Historic Resources Commission meeting{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          (if in{' '}
          <a
            href="https://ashevillenc.gov/department/planning-urban-design/historic-resources/historic-district-guidelines/"
            rel="noreferrer"
          >
            a historic district{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          or concerning a{' '}
          <a
            href="https://ashevillenc.gov/department/planning-urban-design/historic-resources/landmarks/"
            rel="noreferrer"
          >
            historic landmark{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          )
        </li>
      </ul>
    ),
    examples: (
      <ul className="list-disc ml-6">
        <li>A 45-unit residential development</li>
        <li>A new grocery store</li>
        <li>A big box specialty retailer</li>
      </ul>
    ),
    // recentAppsLink: (
    //   <a href="/development/major?permit_type=level%20II%20#data">
    //     Recently submitted Level II projects
    //   </a>
    // ),
  },
  color: '#24798F',
  tw: 'bg-[#24798F] text-white',
};
trcProjectTypes['Conditional Zoning'] = {
  id: 'Conditional Zoning',
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Conditional Zoning',
  short: 'CZ',
  descriptors: {
    whyLevel: (
      <ul className="list-disc ml-6">
        <li>
          The development will have a significant impact upon public services and infrastructure
        </li>
        <li>
          Approval requires a rezoning to one of the expansion zoning districts found in Article
          VIII of the UDO
        </li>
        <li>
          Exact thresholds for Conditional Zoning are defined by{' '}
          <a
            href="https://codelibrary.amlegal.com/codes/ashevillenc/latest/asheville_nc/0-0-0-4236"
            rel="noreferrer"
          >
            Section 7-5-9 of the UDO{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
        </li>
      </ul>
    ),
    participationOpp: (
      <ul className="list-disc ml-6">
        <li>
          <a href="/development/major/engage">Neighborhood meeting</a>
        </li>
        <li>Design review (if downtown or on the river)</li>
        <li>
          <a
            href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/historic-resources-commission/"
            rel="noreferrer"
          >
            Historic Resources Commission meeting{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          (if in{' '}
          <a
            href="https://ashevillenc.gov/department/planning-urban-design/historic-resources/historic-district-guidelines/"
            rel="noreferrer"
          >
            a historic district{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          or concerning a{' '}
          <a
            href="https://ashevillenc.gov/department/planning-urban-design/historic-resources/landmarks/"
            rel="noreferrer"
          >
            historic landmark{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          )
        </li>
        <li>
          <a
            href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/planning-and-zoning-commission/"
            rel="noreferrer"
          >
            Planning and Zoning Commission{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
        </li>
        <li>
          <a href="https://ashevillenc.gov/government" rel="noreferrer">
            City Council <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          hearing
        </li>
      </ul>
    ),
    examples: (
      <ul className="list-disc ml-6">
        <li>250-unite apartment complex</li>
        <li>Corporate or industrial campus</li>
        <li>Mixed use development with large retail stores</li>
      </ul>
    ),
    // recentAppsLink: (
    //   <a href="/development/major?permit_type=Conditional%20Zoning#data">
    //     Recently submitted Conditional Zoning projects
    //   </a>
    // ),
  },
  color: '#9B6681',
  tw: 'bg-[#9B6681] text-white',
};
trcProjectTypes['Special Use Permit'] = {
  id: 'Special Use Permit',
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Special Use',
  short: 'SUP',
  descriptors: {
    whyLevel: (
      <React.Fragment>
        This is highly specialized permit process for land uses with potential public impacts that
        require individual consideration of their location, design, configuration and operation.
        These uses are defined by{' '}
        <a
          href="https://codelibrary.amlegal.com/codes/ashevillenc/latest/asheville_nc/0-0-0-9775"
          rel="noreferrer"
        >
          Section 7-16-2 of the Unified Development Ordinance{' '}
          <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
          <span className="sr-only">(external site)</span>
        </a>
        .
      </React.Fragment>
    ),
    participationOpp: (
      <ul className="list-disc ml-6">
        <li>
          <a href="/development/major/engage">Neighborhood meeting</a>
        </li>
        <li>Design review (if downtown or on the river)</li>
        <li>
          <a
            href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/historic-resources-commission/"
            rel="noreferrer"
          >
            Historic Resources Commission meeting{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          (if in{' '}
          <a
            href="https://ashevillenc.gov/department/planning-urban-design/historic-resources/historic-district-guidelines/"
            rel="noreferrer"
          >
            a historic district{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          or concerning a{' '}
          <a
            href="https://ashevillenc.gov/department/planning-urban-design/historic-resources/landmarks/"
            rel="noreferrer"
          >
            historic landmark{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          )
        </li>
        <li>
          <a
            href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/planning-and-zoning-commission/"
            rel="noreferrer"
          >
            Planning and Zoning Commission{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
        </li>
      </ul>
    ),
    examples: (
      <ul className="list-disc ml-6">
        <li>Cell phone towers</li>
        <li>Jails</li>
        <li>Government buildings</li>
        <li>Group homes</li>
      </ul>
    ),
    // recentAppsLink: (
    //   <div>
    //     <span>
    //       Note: Special Use Permits are temporarily listed as "Conditional Use" within the
    //       data.{' '}
    //     </span>{' '}
    //     <a href="/development/major?permit_type=conditional%20use#data">
    //       Recently submitted Special Use Permits
    //     </a>
    //   </div>
    // ),
  },
  color: '#073d49',
  tw: 'bg-[#073d49] text-white',
};

export const whoIcons = {
  dev: {
    label: 'Developer',
    icon: <Icon path={DRAFTING_COMPASS} viewBox="0 0 512 512" hidden="true" />,
    // bIcon: 'bi bi-compass',
  },
  staff: {
    label: 'City Staff',
    icon: <CityLogoSvg color="black" height={16} hidden="true" />,
    // bIcon: 'bi bi-compass',
  },
  council: {
    label: 'City Officials',
    icon: <Icon path={GAVEL} viewBox="0 0 512 512" hidden="true" />,
    // bIcon: 'bi bi-gavel',
  },
  neighbors: {
    label: 'Neighbors',
    icon: <Icon path={USER_FRIENDS} viewBox="0 0 640 512" size={19} hidden="true" />,
    // bIcon: 'bi bi-people',
  },
};

export const decisionIconHeader = (
  <div className="px-4">
    <div className="flex items-center justify-start gap-1">
      <i className="bi bi-check2" aria-hidden="true"></i>
      <span>Approved</span>
    </div>
    <div className="flex items-center justify-start gap-1">
      <i className="bi bi-x-lg" aria-hidden="true"></i>
      <span>Denied</span>
    </div>
    <div className="flex items-center justify-start gap-1">
      <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
      <span>Revise</span>
    </div>
  </div>
);

const decisionNodeMaxWidth = 400;
export const dagreNodes = [
  {
    id: 'Before the application is submitted',
    htmlId: 'before-application',
    subNodes: [
      {
        id: 'Pre-application meeting',
        htmlId: 'pre-application-meeting',
        steps: {
          what: 'Developers and city staff meet to look at initial sketches, discuss process and schedule, and identify applicable regulations.',
          who: ['dev', 'staff'],
          when: 'Required before application submission',
          where: (
            <a href="https://goo.gl/maps/FYcn1ATUY7Ux8q6G9" rel="noreferrer">
              Development Services Department offices
            </a>
          ),
        },
      },
      {
        id: 'Neighborhood meeting',
        htmlId: 'neighborhood-meeting',
        steps: {
          what: 'Developers must notify all property owners within 200 feet of the proposed development site.  Neighbors meet with developers to collaborate on neighborhood needs and opportunities.',
          who: ['dev', 'neighbors'],
          when: <React.Fragment>Ten days before application submission</React.Fragment>,
          where: 'Somewhere near the proposed development site, specified in the notice',
        },
      },
    ],
    typeIds: ['Level II', 'Major Subdivision', 'Conditional Zoning', 'Special Use Permit'],
  },
  {
    id: 'Permit application',
    htmlId: 'permit-application',
    steps: {
      what: (
        <React.Fragment>
          Submission of required plans and documents and payment of application fees to the{' '}
          <a href="https://www.ashevillenc.gov/department/development-services/" rel="noreferrer">
            Development Services Department{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          .
        </React.Fragment>
      ),
      who: ['dev'],
      when: 'After all required preliminary steps are completed.',
      where: (
        <a href="https://goo.gl/maps/FYcn1ATUY7Ux8q6G9" rel="noreferrer">
          Development Services Department offices{' '}
          <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
          <span className="sr-only">(external site)</span>
        </a>
      ),
    },
    typeIds: [
      'Level I',
      'Level II',
      'Major Subdivision',
      'Conditional Zoning',
      'Special Use Permit',
    ],
  },
  {
    id: 'Staff review',
    htmlId: 'staff-review',
    steps: {
      what: 'A staff member reviews plans for compliance with applicable ordinances and documents and creates a report.',
      who: ['staff'],
      when: 'Within ten days of application submittal',
      where: (
        <a href="https://goo.gl/maps/FYcn1ATUY7Ux8q6G9" rel="noreferrer">
          Development Services Department offices{' '}
          <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
          <span className="sr-only">(external site)</span>
        </a>
      ),
    },
    typeIds: ['Level I'],
  },
  {
    id: 'Level I decision',
    htmlId: 'level-1-decision',
    decisionNode: true,
    typeIds: ['Level I'],
    maxWidth: decisionNodeMaxWidth,
  },
  {
    id: 'Technical Review Committee',
    htmlId: 'technical-review-committee',
    steps: {
      what: (
        <React.Fragment>
          An eight-member body that ensures that the proposed project complies with standards and
          requirements. Meeting agendas are available on{' '}
          <a
            href="https://www.ashevillenc.gov/department/city-clerk/boards-and-commissions/technical-review-committee/"
            rel="noreferrer"
          >
            the city website <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          .
        </React.Fragment>
      ),
      who: ['dev', 'staff'],
      when: 'First and third Monday of each month',
      where: (
        <a href="https://goo.gl/maps/FYcn1ATUY7Ux8q6G9" rel="noreferrer">
          Development Services Department offices{' '}
          <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
          <span className="sr-only">(external site)</span>
        </a>
      ),
    },
    typeIds: ['Level II', 'Major Subdivision', 'Conditional Zoning', 'Special Use Permit'],
  },
  {
    id: 'Major Subdivision and Level II decision (not downtown)',
    htmlId: 'major-subdivision-level-2-decision',
    decisionNode: true,
    typeIds: ['Level II', 'Major Subdivision'],
    maxWidth: decisionNodeMaxWidth,
  },
  {
    id: 'Design review',
    htmlId: 'design-review',
    steps: {
      what: (
        <div>
          Projects located Downtown, in the River District, or involving a historic landmark or site
          must be reviewed for architectural design elements by a special design review
          sub-committee of the{' '}
          <a
            href="https://www.ashevillenc.gov/department/city-clerk/boards-and-commissions/downtown-commission/"
            rel="noreferrer"
          >
            Asheville Downtown Commission{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          , the{' '}
          <a
            href="https://www.ashevillenc.gov/department/city-clerk/boards-and-commissions/asheville-area-riverfront-redevelopment-commission/"
            rel="noreferrer"
          >
            Asheville Area Riverfront Redevelopment Commission{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          , or the{' '}
          <a
            href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/historic-resources-commission/"
            rel="noreferrer"
          >
            Historic Resources Commission{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          , respectively, prior to approval.
        </div>
      ),
      who: ['dev', 'staff', 'neighbors'],
      when: (
        <ul className="p-0">
          <li>Downtown Commission: second Friday of each month</li>
          <li>Riverfront Commission: second Thursday of each month</li>
          <li>Historic Resources Commission: second Wednesday of each month</li>
        </ul>
      ),
      where: (
        <ul className="p-0">
          <li>
            Downtown Commission:{' '}
            <a href="https://goo.gl/maps/7GkCkb1pPjRaXbAc7" rel="noreferrer">
              City Hall <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
              <span className="sr-only">(external site)</span>
            </a>
          </li>
          <li>
            Riverfront Commission:{' '}
            <a href="https://goo.gl/maps/Wbamfs7tbhSmQ1Uz7" rel="noreferrer">
              Explore Asheville offices{' '}
              <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
              <span className="sr-only">(external site)</span>
            </a>
          </li>
          <li>
            Historic Resources Commission:{' '}
            <a href="https://goo.gl/maps/7GkCkb1pPjRaXbAc7" rel="noreferrer">
              City Hall <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
              <span className="sr-only">(external site)</span>
            </a>
          </li>
        </ul>
      ),
    },
    typeIds: ['Level II', 'Major Subdivision', 'Conditional Zoning', 'Special Use Permit'],
  },
  {
    id: 'Major Subdivision decision (downtown)',
    htmlId: 'major-subdivision-decision-downtown',
    decisionNode: true,
    typeIds: ['Major Subdivision'],
    maxWidth: decisionNodeMaxWidth,
  },
  {
    id: 'Planning and Zoning Commission',
    htmlId: 'planning-and-zoning-commission',
    steps: {
      what: (
        <React.Fragment>
          For Conditional Zoning, Special Use, and Level III projects, the{' '}
          <a
            href="https://www.ashevillenc.gov/department/city-clerk/boards-and-commissions/planning-and-zoning-commission/"
            rel="noreferrer"
          >
            Planning and Zoning Commission{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>{' '}
          holds a public hearing and makes a recommendation for action to City Council. For downtown
          Level II projects, the Planning and Zoning Commission verifies technical compliance with
          the requirements of applicable ordinances and documents and takes final action.
        </React.Fragment>
      ),
      who: ['dev', 'staff', 'neighbors', 'council'],
      when: (
        <React.Fragment>
          Per{' '}
          <a href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/planning-and-zoning-commission/">
            published schedule
          </a>
        </React.Fragment>
      ),
      where: (
        <a href="https://goo.gl/maps/7GkCkb1pPjRaXbAc7" rel="noreferrer">
          City Hall <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
          <span className="sr-only">(external site)</span>
        </a>
      ),
    },
    typeIds: ['Level II', 'Conditional Zoning', 'Special Use Permit'],
  },
  {
    id: 'Level II decision (downtown)',
    htmlId: 'level-2-decision-downtown',
    decisionNode: true,
    typeIds: ['Level II'],
    maxWidth: decisionNodeMaxWidth,
  },
  {
    id: 'City Council',
    steps: {
      what: (
        <React.Fragment>
          Applications are reviewed during a public hearing before{' '}
          <a href="https://www.ashevillenc.gov/government/meet-city-council/" rel="noreferrer">
            City Council <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          . These projects arrive at the City Council meeting with a recommendation for action that
          has been sent by the Planning and Zoning Commission.
        </React.Fragment>
      ),
      who: ['dev', 'staff', 'neighbors', 'council'],
      when: 'The second and fourth Tuesday of each month',
      where: (
        <a href="https://goo.gl/maps/7GkCkb1pPjRaXbAc7" rel="noreferrer">
          City Hall <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
          <span className="sr-only">(external site)</span>
        </a>
      ),
    },
    typeIds: ['Conditional Zoning'],
  },
  {
    id: 'City Council decision',
    htmlId: 'city-council-decision',
    decisionNode: true,
    typeIds: ['Conditional Zoning'],
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
      { id: 'Special Use Permit' },
    ],
  },
  {
    source: 'Permit application',
    target: 'Staff review',
    parallelEdges: [{ id: 'Level I' }],
  },
  {
    source: 'Permit application',
    target: 'Technical Review Committee',
    parallelEdges: [
      { id: 'Major Subdivision' },
      { id: 'Level II' },
      { id: 'Conditional Zoning' },
      { id: 'Special Use Permit' },
    ],
  },
  {
    source: 'Staff review',
    target: 'Level I decision',
    id: 'Level I',
    parallelEdges: [{ id: 'Level I' }],
  },
  {
    source: 'Technical Review Committee',
    target: 'Major Subdivision and Level II decision (not downtown)',
    parallelEdges: [{ id: 'Major Subdivision' }, { id: 'Level II' }],
  },
  {
    source: 'Design review',
    target: 'Planning and Zoning Commission',
    parallelEdges: [{ id: 'Level II' }, { id: 'Conditional Zoning' }, { id: 'Special Use Permit' }],
  },
  {
    source: 'Design review',
    target: 'Major Subdivision decision (downtown)',
    parallelEdges: [{ id: 'Major Subdivision' }],
  },
  {
    source: 'Technical Review Committee',
    target: 'Design review',
    parallelEdges: [
      { id: 'Level II' },
      { id: 'Major Subdivision' },
      { id: 'Conditional Zoning' },
      { id: 'Special Use Permit' },
    ],
  },
  {
    source: 'Planning and Zoning Commission',
    target: 'Level II decision (downtown)',
    parallelEdges: [{ id: 'Level II' }],
  },
  {
    source: 'Planning and Zoning Commission',
    target: 'City Council',
    parallelEdges: [{ id: 'Conditional Zoning' }],
  },
  {
    source: 'City Council',
    target: 'City Council decision',
    parallelEdges: [{ id: 'Conditional Zoning' }],
  },
];
