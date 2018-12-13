import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import { curveBundle } from 'd3-shape';
import { ResponsiveNetworkFrame } from 'semiotic';
import { Annotation, ConnectorCurve, Note } from 'react-annotation';
import SectionNav from './SectionNav';
import AnnotatedDagre from './AnnotatedDagre';
import ProjectsTable from './ProjectsTable';

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

function debounce(func, wait, immediate) {
  // from lodash... should probably just use lodash
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


class MajorDevelopmentDashboard extends React.Component {
  constructor(){
    super();

    const sectionNavLinks = [
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

    this.state = {
      sectionNavLinks,
    }

    this.handleScroll = debounce(this.handleScroll.bind(this), 200)
  }

  componentDidMount() {
    // window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    const changePoint = document.documentElement.clientHeight - 250;
    let closestDistanceToChange = null;
    let closestNavLinkId = null;

    this.state.sectionNavLinks.forEach(navLink => {
      const thisRef = navLink.ref.current.getBoundingClientRect();

      if (thisRef.top < changePoint && (!closestDistanceToChange || thisRef.top > closestDistanceToChange)) {
        // If the top of this ref is above the bottom of the screen
        // AND
        // If there isn't already a closest distance assigned
        // OR
        // If it's above below the current closest ref, make it the selected one
        closestNavLinkId = navLink.linkId;
        closestDistanceToChange = thisRef.top;
      }
    })

    const newSectionNavLinks = this.state.sectionNavLinks.map(navLink => {
      const rObj = Object.assign({}, navLink)
      if (navLink.linkId !== closestNavLinkId) {
        rObj.selected = false;
        return rObj;
      }
      rObj.selected = true;
      return rObj;
    })

    this.setState({
      sectionNavLinks: newSectionNavLinks,
    });
  }

  render() {
    return (<div id="majorDevDash" style={{ width: 'inherit' }}>
      <SectionNav
        links={this.state.sectionNavLinks}
      />
      <div style={{ height: '4em' }}></div>

      <section
        id="about"
        className="col-md-12"
        ref={this.state.sectionNavLinks.find(d => d.linkId === 'about').ref}
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
        ref={this.state.sectionNavLinks.find(d => d.linkId === 'notifications').ref}
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
        ref={this.state.sectionNavLinks.find(d => d.linkId === 'data').ref}
        className="col-md-12"
      >
        <h2>Current Projects</h2>
        <p>Here we should put a table like the <a href="https://simplicity.ashevillenc.gov/CAPITAL_PROJECTS?entities=address%2Cproperty%2Cneighborhood%2Cstreet%2Cowner&entity=city&id=&label=City+of+Asheville&search=&view=map&x=&y=">capital projects dashboard</a> that includes the following Accela record types:</p>
        <ul>
          <li>Planning - Subdivision - Major</li>
          <li>Planning - Development - Level I</li>
          <li>Planning - Development - Level II</li>
          <li>Planning - Development - Level III</li>
          <li>Planning - Development - Conditional Zoning</li>
          <li>Planning - Development - Conditional Use</li>
          <li>Anything else?  HRC?  <a href="https://simplicity.ashevillenc.gov/development/granular_volume?module=planning">See here for types</a>, or look <a href="https://bl.ocks.org/mmazanec22/raw/552ea8bb2d9fe624eca79af717bb726b/">here</a></li>
        </ul>
        <p>Should probably toggle to map view?</p>
        <ProjectsTable
          projectTypes={projectTypes}
        />
      </section>

      <section
        id="calendar"
        ref={this.state.sectionNavLinks.find(d => d.linkId === 'calendar').ref}
        className="col-md-12"
      >
        <h2>Upcoming Public Events</h2>
        <p>Calendar?  Listed by area?  On a map?  Collapsed into table above?</p>
      </section>

      <section
        id="faq"
        ref={this.state.sectionNavLinks.find(d => d.linkId === 'faq').ref}
        className="col-md-12"
      >
        <h2>FAQ</h2>
      </section>
    </div>)
  }

}

export default MajorDevelopmentDashboard;
