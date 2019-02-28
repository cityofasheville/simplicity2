import React from 'react';
import PropTypes from 'prop-types';
import SectionNav from './SectionNav';
import AnnotatedDagre from './AnnotatedDagre';
import TRCDataTable from './TRCDataTable';
import Accordion from '../../../shared/visualization/Accordion';
import { trcProjectTypes } from './utils';

const projectTypes = trcProjectTypes;

// Assign colors to project types
const orderedColors = [
  '#FF3A3A',
  '#749B5F',
  '#2d93ad',
  '#004EA3',
  '#9B6681',
  '#9E4F55',
  '#073d49',
];
Object.keys(projectTypes).forEach((type, i) => {
  projectTypes[type].color = orderedColors[i];
});


class MajorDevelopmentDashboard extends React.Component {
  constructor() {
    super();

    this.sectionNavLinks = [
      {
        linkId: 'about',
        linkName: 'About',
        selected: true,
      },
      {
        linkId: 'notifications',
        linkName: 'Get Notifications',
      },
      {
        linkId: 'data',
        linkName: 'Project Details',
      },
      {
        linkId: 'calendar',
        linkName: 'Public Meetings',
      },
      {
        linkId: 'faq',
        linkName: 'Frequently Asked Questions',
      },
    ].map((d) => {
      const rObj = Object.assign({}, d);
      rObj.ref = React.createRef();
      return rObj;
    });
  }

  render() {
    return (<div id="majorDevDash" style={{ width: 'inherit' }}>
      <SectionNav
        links={this.sectionNavLinks}
      />
      <div style={{ height: '4em' }}></div>

      <section
        id="about"
        className="col-md-12"
        ref={this.sectionNavLinks.find(d => d.linkId === 'about').ref}
      >
        <h1>Major Development in Asheville</h1>
        <p>When someone wants to build or modify a building on private property in the City of Asheville, they must comply with federal, state, county, and city standards. Which standards apply depends on how large the building is or how much the building will be modified.</p>
        <p>After the developer submits an application, it goes through a decision-making process that includes city staff, city council, developers, and residents.  Who is involved at what step depends on the type of project.</p>
        <p>The Unified Development Ordinance defines six types of large scale development in Asheville.</p>
        <p>Depending on the type of project, there are three to eight steps.</p>
        <AnnotatedDagre
          projectTypes={projectTypes}
        />
      </section>

      <section
        id="notifications"
        ref={this.sectionNavLinks.find(d => d.linkId === 'notifications').ref}
        className="col-md-12"
      >
        <h2> Sign up for Notifications </h2>
        <p>The City of Asheville is piloting a new notification system that allows people to sign up for non-emergency alerts based on city data.  You can go to notifications.ashevillenc.gov to sign up for alerts about Level I and larger projects.</p>
      </section>

      <section
        id="data"
        ref={this.sectionNavLinks.find(d => d.linkId === 'data').ref}
        className="col-md-12"
      >
        <h2>Project Details</h2>
        <p>The table below contains proposed, large-scale, private development projects for which a permit application has been submitted.  You can also see a <a href="/permits">table of all permit applications</a> or <a href="/">search an address</a> to find nearby development.</p>
        <TRCDataTable />
      </section>

      <section
        id="calendar"
        ref={this.sectionNavLinks.find(d => d.linkId === 'calendar').ref}
        className="col-md-12"
      >
        <h2>Upcoming Public Meetings</h2>
        <p>Developers planning to submit applications for development that must go through the Technical Review Committee must hold a public meeting before submitting the application.</p>
        <p>Currently, developers are not required to notify the City of Asheville when those meetings take place.  Thus, the first record the city has of a proposed development is when the application is submitted, after the meeting.</p>
        <p>However, some developers choose to voluntarily notify the city.  After those developers fill out an online form, those meeting dates are automatically added to <a target="_blank" rel="noopener noreferrer" href="https://calendar.google.com/calendar/embed?src=ashevillenc.gov_gk5l650n9mopts9m7sfemhcpd8%40group.calendar.google.com&ctz=America%2FNew_York">this calendar</a>.</p>
      </section>

      <section
        id="faq"
        ref={this.sectionNavLinks.find(d => d.linkId === 'faq').ref}
        className="col-md-12"
      >
        <h2>FAQ</h2>
        {/* https://getbootstrap.com/docs/3.4/javascript/#collapse */}
        {/* TODO: WHY DOES COLLAPSE TRIGGER RE-RENDER? */}
        <Accordion
          data={[
            {
              header: 'Why is the sky blue?',
              body: 'Something something light refracting',
            },
            {
              header: 'What day is it?',
              body: new Date().toLocaleDateString('en-us'),
            },
            {
              header: 'Why?',
              body: '42',
            },
          ]}
        />

      </section>
    </div>)
  }

}

export default MajorDevelopmentDashboard;
