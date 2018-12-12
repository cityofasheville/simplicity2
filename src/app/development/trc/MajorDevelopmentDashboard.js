import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import { curveBundle } from 'd3-shape';
import { ResponsiveNetworkFrame } from 'semiotic';
import { Annotation, ConnectorCurve, Note } from 'react-annotation';
import SectionNav from './SectionNav';


const orderedColors = ['#FF3A3A','#749B5F','#2d93ad','#004EA3','#9B6681','#9E4F55','#073d49']
const nodeSize = 8;
const nodes = [
  {
    id: 'Pre-Application Meeting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'Neighborhood Meeting',
    description: 'The developer must arrange a neighborhood meeting and invite property owners within 200 feet of the proposed development. The meeting must be no more than four months but at least ten days before application submission. At least ten days prior to the meeting, property must be posted and notice of the meeting mailed.'
  },
  {
    id: 'Level I',
    description: 'Projects smaller than 35,000 square feet or with fewer than 20 residential units.',
  },
  {
    id: 'Major Subdivision',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'Level II',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'Level III',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'Conditional Zoning',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'Conditional Use Permit',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'Staff Review',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'Level I Decision',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'Technical Review Committee',
    description: 'An eight-member body that ensures that the proposed project complies with standards and requirements. Consists of six staff, a representative of the Tree Commission, and a member representing the Buncombe County Metropolitan Sewer District (MSD).',
  },
  {
    id: 'Major Subdivision Decision',
    description: 'For major subdivisions that are not in a special zoning area like downtown, the Technical Review Committee either accepts or rejects the proposal.'
  },
  {
    id: 'Design Review',
    description: 'All level II, downtown subdivisions, and special zoning district L3 etc go to desgin review. The decision made in this step is a a non-binding recommendation.'
  },
  {
    id: 'Planning and Zoning Commission',
    description: 'The Commission consists of 7 members, 5 City residents appointed by City Council and 2 residents of the extra-territorial area of the City and appointed by Buncombe County Commissioners. The length of term of office is three years.',
  },
  {
    id: 'Level II and Downtown Major Subdivision Decision',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'City Council',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'City Council Decision',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]
const links = [
  {
    source: 'Pre-Application Meeting',
    target: 'Level I',
    color: orderedColors[0],
  },
  {
    source: 'Neighborhood Meeting',
    target: 'Level I',
    color: orderedColors[0],
  },
  {
    source: 'Pre-Application Meeting',
    target: 'Major Subdivision',
    color: orderedColors[1],
  },
  {
    source: 'Neighborhood Meeting',
    target: 'Major Subdivision',
    color: orderedColors[1],
  },
  {
    source: 'Pre-Application Meeting',
    target: 'Level II',
    color: orderedColors[2],
  },
  {
    source: 'Neighborhood Meeting',
    target: 'Level II',
    color: orderedColors[2],
  },
  {
    source: 'Pre-Application Meeting',
    target: 'Level III',
    color: orderedColors[3],
  },
  {
    source: 'Neighborhood Meeting',
    target: 'Level III',
    color: orderedColors[3],
  },
  {
    source: 'Pre-Application Meeting',
    target: 'Conditional Zoning',
    color: orderedColors[4],
  },
  {
    source: 'Neighborhood Meeting',
    target: 'Conditional Zoning',
    color: orderedColors[4],
  },
  {
    source: 'Pre-Application Meeting',
    target: 'Conditional Use Permit',
    color: orderedColors[5],
  },
  {
    source: 'Neighborhood Meeting',
    target: 'Conditional Use Permit',
    color: orderedColors[5],
  },
  {
    source: 'Level I',
    target: 'Staff Review',
    color: orderedColors[0],
  },
  {
    source: 'Major Subdivision',
    target: 'Staff Review',
    color: orderedColors[1],
  },
  {
    source: 'Level II',
    target: 'Staff Review',
    color: orderedColors[2],
  },
  {
    source: 'Level III',
    target: 'Staff Review',
    color: orderedColors[3],
  },
  {
    source: 'Conditional Zoning',
    target: 'Staff Review',
    color: orderedColors[4],
  },
  {
    source: 'Conditional Use Permit',
    target: 'Staff Review',
    color: orderedColors[5],
  },
  {
    source: 'Staff Review',
    target: 'Level I Decision',
    color: orderedColors[0],
  },
  {
    source: 'Staff Review',
    target: 'Technical Review Committee',
    parallelEdges: [
      { color: orderedColors[1], weight: 3 },
      { color: orderedColors[2], weight: 3 },
      { color: orderedColors[3], weight: 3 },
      { color: orderedColors[4], weight: 3 },
      { color: orderedColors[5], weight: 3 },
    ]
  },
  {
    source: 'Technical Review Committee',
    target: 'Major Subdivision Decision',
    color: orderedColors[1],
  },
  {
    source: 'Technical Review Committee',
    target: 'Design Review',
    // All level II, downtown subdivisions, and special district L3 etc go to desgin review?
    parallelEdges: [
      { color: 'gray', weight: 3 },
      { color: orderedColors[2], weight: 3 },
    ]
  },
  {
    source: 'Design Review',
    target: 'Planning and Zoning Commission',
    parallelEdges: [
      { color: 'gray', weight: 3 },
      { color: orderedColors[2], weight: 3 },
    ]
  },
  {
    source: 'Technical Review Committee',
    target: 'Planning and Zoning Commission',
    parallelEdges: [
      { color: orderedColors[3], weight: 3 },
      { color: orderedColors[4], weight: 3 },
      { color: orderedColors[5], weight: 3 },
    ]
  },
  {
    source: 'Planning and Zoning Commission',
    target: 'Level II and Downtown Major Subdivision Decision',
    parallelEdges: [
      { color: 'gray', weight: 3 },
      { color: orderedColors[2], weight: 3 },
    ]
  },
  {
    source: 'Planning and Zoning Commission',
    target: 'City Council',
    parallelEdges: [
      { color: orderedColors[3], weight: 3 },
      { color: orderedColors[4], weight: 3 },
      { color: orderedColors[5], weight: 3 },
    ]
  },
  {
    source: 'City Council',
    target: 'City Council Decision',
    parallelEdges: [
      { color: orderedColors[3], weight: 3 },
      { color: orderedColors[4], weight: 3 },
      { color: orderedColors[5], weight: 3 },
    ]
  },
]

function calculateEdges(link) {
  const weight = 2;
  if (link.parallelEdges) {
    return link.parallelEdges.map(e => {
      const thisEdge = Object.assign({}, e);
      thisEdge.weight = weight;
      return thisEdge;
    })
  }
  return [{ color: link.color ? link.color : 'gray', weight: weight}];
}

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

function getDagreGraph() {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir:  'TB', ranker: 'network-simplex'})
  g.setDefaultEdgeLabel(() => ({}))

  nodes.forEach(node => {
    g.setNode(
      node.id,
      {
        label: node.id,
        width: node.width || nodeSize,
        height: node.height || nodeSize,
        description: node.description,
        color: node.color ? node.color : 'gray',
      }
    );
  })

  links.forEach(link => {
    g.setEdge(
      link.source,
      link.target,
      {
        parallelEdges: calculateEdges(link),
      }
    );
  })

  dagre.layout(g);

  return g;
}

function getAnnotations(dagreGraph) {
  const nodeValues = Object.values(dagreGraph._nodes);
  nodeValues.forEach(d => {
    d.coincidents = nodeValues.filter(val => val.y === d.y)
    d.indexInCoincidents = d.coincidents.findIndex(c => c.label === d.label)
  })
  return nodeValues.map(d => {
    const rVal = {
      id: d.label,
      coincidents: d.coincidents,
      indexInCoincidents: d.indexInCoincidents,
      description: d.description,
      color: 'black',
      connector: { end: 'none' },
      disable: 'subject',
      type: 'node',
    };
    return rVal;
  })
}


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

    this.graph = getDagreGraph();
    this.annotations = getAnnotations(this.graph);

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
    // TODO: use section element?
    // Make colors/types of project into key val pair to avoid insanity later
    // Why is H1 smaller than H2 on mobile?

    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;
    const sideMargin = screenWidth / 12;
    const height = 4500;
    const verticalMargin = Math.max(80, 80 * (700 / screenWidth));
    const fontSize = screenWidth < 750 ? 12 : 14;

    return (<div id="majorDevDash" style={{ width: 'inherit' }}>
      {/* Highlight/anchor nav button bar */}
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
        <div style={{ width: '100%', height: height, display: 'inline-block', fontSize }}>
          <ResponsiveNetworkFrame
            size={[320, 1000]}
            margin={{top: verticalMargin, right: sideMargin, bottom: 0, left: sideMargin }}
            responsiveWidth
            responsiveHeight
            graph={this.graph}
            annotations={this.annotations}
            svgAnnotationRules={(d) => {
              // Side padding and padding between
              const notePadding = fontSize / 2;
              const annotationMargin = fontSize + notePadding;
              const numPerRow = d.d.coincidents.length < 3 ? d.d.coincidents.length : Math.ceil(d.d.coincidents.length / 2);
              // Max number of rows is two
              const midRowIndex = (numPerRow - 1) / 2;
              const defaultOffsetY = fontSize * 3;
              const wrap = Math.min(
                (screenWidth - sideMargin * 2 - (annotationMargin + annotationMargin * numPerRow)) / numPerRow,
                400
              )
              const midpointX = d.networkFrameState.adjustedSize[0] / 2;

              let thisYOffset = - defaultOffsetY;
              let thisXOffset = 0;
              let curveBeta = 0.25;

              // split into rows
              if (d.d.coincidents.length > 2) {
                curveBeta = 0.5
                if (d.d.indexInCoincidents >= d.d.coincidents.length / 2) {
                  thisYOffset = defaultOffsetY * 2;
                }
              }

              const xPosition = midpointX + ((d.d.indexInCoincidents % numPerRow) - midRowIndex) * (annotationMargin + wrap);
              thisXOffset = xPosition - d.d.x;

              return (<Annotation
                x={d.d.x}
                y={d.d.y}
                dy={thisYOffset}
                dx={thisXOffset}
                color="gray"
                title={d.d.label}
                label={d.d.description}
                className="show-bg"
                disable="subject"
                key={`${d.d.label}-annotation`}
              >
                <ConnectorCurve
                  curve={curveBundle.beta(curveBeta)}
                />
                <Note
                  align={'middle'}
                  orientation={"topBottom"}
                  bgPadding={notePadding}
                  padding={notePadding}
                  titleColor={"gray"}
                  lineType={null}
                  wrap={wrap}
                />
              </Annotation>)
            }}
            networkType={{
              type: 'dagre',
              zoom: 'true',
            }}
            edgeStyle={d => ({ stroke: 'white', fill: d.color, strokeWidth: 1 })}
            customNodeIcon={(d) => {
              return (<circle
                cx={d.d.x}
                cy={d.d.y}
                r={fontSize}
                style={{ fill: '#d9d9d9', stroke: 'gray' }}
              />)
            }}
          />
        </div>
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
          <li>CUP-- where are they?</li>
          <li>Anything else?  HRC?  <a href="https://simplicity.ashevillenc.gov/development/granular_volume?module=planning">See here for types</a></li>
        </ul>
        <p>Should probably toggle to map view?</p>
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
