import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import { ResponsiveNetworkFrame } from 'semiotic';
import AnchorNav from './AnchorNav';
import { colorScheme } from '../volume/granularUtils';

const g = new dagre.graphlib.Graph()
g.setGraph({ rankdir:  'TB', ranker: 'network-simplex' })
g.setDefaultEdgeLabel(() => ({}))

const nodeSize = 160;
const orderedColors = ['#FF3A3A','#749B5F','#2d93ad','#004EA3','#9B6681','#9E4F55','#073d49']


// https://emeeks.github.io/semiotic/#/semiotic/customnode

const nodes = [
  {
    id: 'Level I',
    description: 'Projects smaller than 35,000 square feet or with fewer than 20 residential units.',
    color: orderedColors[0],
  },
  {
    id: 'Major Subdivision',
  },
  {
    id: 'Level II',
  },
  {
    id: 'Level III',
  },
  {
    id: 'Conditional Zoning',
  },
  {
    id: 'Conditional Use Permit',
  },
  {
    id: 'Staff Review',
    width: nodeSize * 3,
  },
  {
    id: 'Level I Decision',
    color: orderedColors[0],
  },
  {
    id: 'Technical Review Committee',
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
  },
  {
    id: 'Level II and Downtown Major Subdivision Decision',
  },
  {
    id: 'City Council',
  },
  {
    id: 'City Council Decision',
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
      width: node.width ? node.width : nodeSize * 0.9,
      height: nodeSize,
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
      parallelEdges: link.parallelEdges || [{ color: link.color ? link.color : 'gray', weight: 3 }],
    }
  );
})

dagre.layout(g)


class MajorDevelopmentDashboard extends React.Component {
  constructor(props){
    super(props);
    // this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    // window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    let scrollTop = event.srcElement.body.scrollTop,
        itemTranslate = Math.min(0, scrollTop/3 - 60);

    // console.log(window.scrollY)
    //
    // console.log(event, scrollTop, itemTranslate)
    //
    // this.setState({
    //   transform: itemTranslate
    // })
  }

  render() {
    const nodeObjects = Object.values(g._nodes);
    Object.keys(g._nodes).forEach(nodeKey => {
      const thisNode = g._nodes[nodeKey]
      const parallelNodes = nodeObjects.filter(d => d.y === thisNode.y)
      const numParallels = parallelNodes.length - 1;
      if (numParallels === 0) {
        g._nodes[nodeKey].width === 320;
        // Smallest screen is iphone 5/SE
      }
      // if number of parallels is more than 1, stagger them vertically in a pattern
      if (numParallels > 1) {
        const numRows = parallelNodes / 2;
        g._nodes[nodeKey].y += (parallelNodes.indexOf(n => n.key === nodeKey) / numRows * thisNode.height);
      }
    })
    console.log(g._nodes)

    return (<div id="majorDevDash">
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
      <div>
      <br/>
      <br/>
      <br/>
      <h1 id="about" >Major Development in Asheville</h1>
      <div style={{ width: '100%', height: nodeSize * 15 }}>
        <ResponsiveNetworkFrame
          size={[1000, 1000]}
          margin={10}
          responsiveWidth
          responsiveHeight
          graph={g}
          networkType={{
            type: 'dagre',
            zoom: 'true'
          }}
          customNodeIcon={(d) => {
            const width = d.d.width
            const height = d.d.height;
            return (<g key={`${d.i}-${d.d.id}`}>
              <foreignObject
                style={{
                  x: d.d.x - width / 2,
                  y: d.d.y - height / 2,
                  width: d.d.width,
                  height: height,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f2f2f2',
                    fontSize: '0.85em',
                    padding: '0.5em',
                    borderRadius: '2px',
                    border: '1px solid #e6e6e6'
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      fontWeight: 'normal',
                      padding: '0 0 0.5em 0',
                      fontSize: '1.25em',
                    }}
                  >
                    {d.d.id}
                  </div>
                  <div>
                    {d.d.description}
                  </div>
                </div>
              </foreignObject>
              </g>)
            }}
          edgeStyle={d => ({ stroke: 'white', fill: d.color, strokeWidth: 2 })}
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
      </div>
    </div>);
  }

}

export default MajorDevelopmentDashboard;
