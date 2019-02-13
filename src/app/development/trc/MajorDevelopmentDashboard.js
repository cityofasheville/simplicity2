import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import { curveBundle } from 'd3-shape';
import { ResponsiveNetworkFrame } from 'semiotic';
import { Annotation, ConnectorCurve, Note } from 'react-annotation';
import SectionNav from './SectionNav';
import AnnotatedDagre from './AnnotatedDagre';
import PermitsTableWrapper from './PermitsTableWrapper';
import Accordion from '../../../shared/visualization/Accordion';
import { trcProjectTypes } from './utils';

const projectTypes = trcProjectTypes;

// Assign colors to project types
const orderedColors = ['#FF3A3A','#749B5F','#2d93ad','#004EA3','#9B6681','#9E4F55','#073d49'];
Object.keys(projectTypes).forEach((type, i) => {
  projectTypes[type].color = orderedColors[i];
})


class MajorDevelopmentDashboard extends React.Component {
  constructor(){
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
        linkName: 'Current Projects'
      },
      // {
      //   linkId: 'calendar',
      //   linkName: 'Public Events'
      // },
      {
        linkId: 'faq',
        linkName: 'Frequently Asked Questions',
      },
    ].map((d, i) => {
      const rObj = Object.assign({}, d);
      rObj.ref = React.createRef();
      return rObj;
    })
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
        <h2>Current Projects</h2>
        <p>The table below contains proposed, large-scale, private development projects for which a permit application has been submitted in the last year.  You can also see a <a href="/permits">table of all permit applications</a> or <a href="/">search an address</a> to find nearby development.</p>
        <PermitsTableWrapper
          projectTypes={projectTypes}
          permit_groups={['Planning']}
        />
      </section>

      {/*<section
        id="calendar"
        ref={this.sectionNavLinks.find(d => d.linkId === 'calendar').ref}
        className="col-md-12"
      >
        <h2>Upcoming Public Events</h2>
        <p>Calendar?  Listed by area?  On a map?  Collapsed into table above?</p>
      </section>*/}

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
