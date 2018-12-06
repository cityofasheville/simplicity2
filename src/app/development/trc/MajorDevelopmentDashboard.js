import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import { ResponsiveNetworkFrame } from 'semiotic';
import AnchorNav from './AnchorNav';
import { colorScheme } from '../volume/granularUtils';

const g = new dagre.graphlib.Graph()
g.setGraph({ rankdir:  'TB', ranker: 'network-simplex'})
g.setDefaultEdgeLabel(() => ({}))

const orderedColors = ['#FF3A3A','#749B5F','#2d93ad','#004EA3','#9B6681','#9E4F55','#073d49']
const nodeSize = 8;


// https://emeeks.github.io/semiotic/#/semiotic/customnode

const nodes = [
  {
    id: 'Level I',
    description: 'Projects smaller than 35,000 square feet or with fewer than 20 residential units.',
  },
  {
    id: 'Major Subdivision',
    description: 'Foo',
  },
  {
    id: 'Level II',
    description: 'Foo',
  },
  {
    id: 'Level III',
    description: 'Foo',
  },
  {
    id: 'Conditional Zoning',
    description: 'Foo',
  },
  {
    id: 'Conditional Use Permit',
    description: 'Foo',
  },
  {
    id: 'Staff Review',
    description: 'Foo',
  },
  {
    id: 'Level I Decision',
    description: 'Foo',
  },
  {
    id: 'Technical Review Committee',
    description: 'Foo',
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
    description: 'Foo',
  },
  {
    id: 'Level II and Downtown Major Subdivision Decision',
    description: 'Foo',
  },
  {
    id: 'City Council',
    description: 'Foo',
  },
  {
    id: 'City Council Decision',
    description: 'Foo',
  },
]

const links = [
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

function calculateEdges(link) {
  const weight = 1.5;
  if (link.parallelEdges) {
    return link.parallelEdges.map(e => {
      const thisEdge = Object.assign({}, e);
      thisEdge.weight = weight;
      return thisEdge;
    })
  }
  return [{ color: link.color ? link.color : 'gray', weight: weight}];
}

links.forEach(link => {
  g.setEdge(
    link.source,
    link.target,
    {
      parallelEdges: calculateEdges(link),
    }
  );
})

dagre.layout(g)

const nodeValues = Object.values(g._nodes);
nodeValues.forEach(d => {
  d.coincidents = nodeValues.filter(val => val.y === d.y)
})
const annotations = nodeValues.map(d => {
  const rVal = {
    description: d.description,
    color: 'black',
    connector: { end: 'none' },
    disable: 'subject',
    nodeSize: nodeSize,
  };
  // if (d.coincidents.length > 1) {
  //   rVal.type = 'enclose';
  //   rVal.ids = d.coincidents.map(c => c.label);
  //   rVal.label = d.coincidents.map(c => `${c.label}: ${c.description}`).join('\n')
  // } else {
    rVal.type = 'node';
    rVal.id = d.label;
  // }
  return rVal;
}).filter((d, i, array) => {
  if (d.ids === undefined) { return true; }
  return array.findIndex(f => f.ids !== undefined && f.ids.join() === d.ids.join()) === i;
})

console.log(nodes, annotations)


class MajorDevelopmentDashboard extends React.Component {
  constructor(){
    super();

    this.dashRef = React.createRef();

    this.nodeRefs = {};
    Object.keys(g._nodes).forEach(nodeKey => {
      this.nodeRefs[nodeKey] = React.createRef();
    })

    this.state = {
      showingNodes: [],
    }

    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    // window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    const showingNodes = [];
    Object.keys(this.nodeRefs).forEach((nodeRefKey, i) => {
      const thisRef = this.nodeRefs[nodeRefKey].current.getBoundingClientRect();
      const nodeShowing = thisRef.top > 120 && thisRef.top < document.documentElement.clientHeight;
      if (nodeShowing) {
        showingNodes.push(nodeRefKey)
      }
    })

    this.setState({
      showingNodes
    })
  }

  render() {

    // TODO:
    // Why is H1 smaller than H2 on mobile?

    return (<div id="majorDevDash" style={{ width: 'inherit' }}>
      {/* Highlight/anchor nav button bar */}
      <AnchorNav
        links={[
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
          rObj.color = colorScheme[i];
          return rObj;
        })}
      />
      <div style={{ height: '4em' }}></div>
      <div
        id="about"
        className="col-md-12"
        style={{
          margin: '0 auto',
          outline: '1px solid gray',
          padding: '0.25em',
          width: 'inherit',
          display: 'block',
        }}
      >
        <h1>Major Development in Asheville</h1>
        <p>The Unified Development Ordinance defines six types of large scale development in Asheville.</p>
      </div>
      <div style={{ width: '80%', height: document.documentElement.clientHeight * 3, display: 'inline-block' }}>
        <ResponsiveNetworkFrame
          size={[200, 1000]}
          margin={{ top: 60, right: 70, bottom: 16, left: 16 }}
          responsiveWidth
          responsiveHeight
          graph={g}
          annotations={annotations}
          annotationSettings={{
            layout: { type: 'bump', orient: 'nearest' },
            pointSizeFunction: d => {console.log(d); return nodeSize * 2},
            connector: { end: 'none' },
          }}
          svgAnnotationRules={(d) => {
            console.log(d)
            return null
          }}
          networkType={{
            type: 'dagre',
            zoom: 'true',
          }}
          edgeStyle={d => ({ stroke: 'white', fill: d.color, strokeWidth: 1 })}
          customNodeIcon={(d) => {
            let fill = 'white';
            if (this.state.showingNodes.indexOf(d.d.id) > -1 || true) {
              fill = '#d9d9d9'
            }

            return (<circle
              cx={d.d.x}
              cy={d.d.y}
              r={nodeSize}
              style={{ fill: fill, stroke: 'none' }}
              ref={this.nodeRefs[d.d.id]}
            />)
          }}
        />
      </div>
      {/* Get notifications */}
      <h2 id="notifications">Sign up for Notifications</h2>
      <br/>
      <br/>
      <br/>
      <br/>
      {/* Data - table and map */}
      <h2 id="data">Current Projects</h2>
      <br/>
      <br/>
      <br/>
      <br/>
      {/* Calendar */}
      <h2 id="calendar">Upcoming Public Events</h2>
      <br/>
      <br/>
      <br/>
      <br/>
      {/* FAQ */}
      <h2 id="faq">FAQ</h2>
    </div>);
  }

}

export default MajorDevelopmentDashboard;
