import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import { curveBundle } from 'd3-shape';
import { ResponsiveNetworkFrame } from 'semiotic';
import { Annotation, ConnectorCurve, Note } from 'react-annotation';
import SectionNav from './SectionNav';
import AnnotatedDagre from './AnnotatedDagre';
import ProjectsTableWrapper from './ProjectsTableWrapper';

const projectTypes = {};
projectTypes['Level I'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Level I',
};
projectTypes['Major Subdivision'] = {
  permit_group: 'Planning',
  permit_type: 'Subdivision',
  permit_subtype: 'Major',
};
projectTypes['Level II'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Level II',
};
projectTypes['Level III'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Level III',
};
projectTypes['Conditional Zoning'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Conditional Zoning',
};
projectTypes['Conditional Use Permit'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Conditional Use',
};
projectTypes['Historic Resources Commission'] = {
  permit_group: 'Planning',
  permit_type: 'HRC',
  permit_subtype: 'Major Work',
};

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
      {
        linkId: 'calendar',
        linkName: 'Public Events'
      },
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

  // shouldComponentUpdate(nextProps) {
  //   console.log(this.props, nextProps)
  //   // TODO: THIS IS VERY HACKY
  //   // WHY ARE WEIRD SCROLLING THINGS HAPPENING?
  //   // if (this.props.location.hash !== nextProps.location.hash) {
  //   //   return false;
  //   // }
  //   // return false;
  // }

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
        <p>Provide your email or a phone number that can receive text messages to get an update when a new major development application has been submitted.</p>
        <div id="signup-form">
          Email: <input type="email" name="email" /><br/>
          Phone: <input type="tel" name="phone" /><br/>
          Geographic area: <select>
            <option value="north">Entire city</option>
            <option value="north">North Asheville</option>
            <option value="east">East Asheville</option>
            <option value="south">South Asheville</option>
            <option value="west">West Asheville</option>
          </select><br/>
          <input type="submit" value="Sign Up" /><br/>
        </div>
        <p>You will receive a message asking you to confirm that you wish to receive notifications.</p>
      </section>

      <section
        id="data"
        ref={this.sectionNavLinks.find(d => d.linkId === 'data').ref}
        className="col-md-12"
      >
        <h2>Current Projects</h2>
        <p>The table below contains projects for which a permit application has been submitted in the last year.</p>
        <ProjectsTableWrapper
          projectTypes={projectTypes}
        />
      </section>

      <section
        id="calendar"
        ref={this.sectionNavLinks.find(d => d.linkId === 'calendar').ref}
        className="col-md-12"
      >
        <h2>Upcoming Public Events</h2>
        <p>Calendar?  Listed by area?  On a map?  Collapsed into table above?</p>
      </section>

      <section
        id="faq"
        ref={this.sectionNavLinks.find(d => d.linkId === 'faq').ref}
        className="col-md-12"
      >
        <h2>FAQ</h2>
      </section>
    </div>)
  }

}

export default MajorDevelopmentDashboard;
