import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import { ResponsiveNetworkFrame } from 'semiotic';
import AnchorNav from './AnchorNav';
import { colorScheme } from '../volume/granularUtils';

const g = new dagre.graphlib.Graph()
g.setGraph({ rankdir:  'TB', ranker: 'network-simplex' })
g.setDefaultEdgeLabel(() => ({}))
const nodeSize = 150;

// https://emeeks.github.io/semiotic/#/semiotic/customnode

const nodes = [
  {
    id: 'Staff Review',
    width: nodeSize * 4,
  },
  {
    id: 'Level I',
    description: 'Projects less than 35,000 square feet or with fewer than 20 residential units',
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
    id: 'Level I: Accepted',
    width: nodeSize / 2,
  },
  {
    id: 'Level I: Rejected',
    width: nodeSize / 2,
  },
  {
    id: 'Technical Review Committee',
    width: nodeSize * 3,
  }
]

const links = [
  {
    source: 'Level I',
    target: 'Staff Review',
    value: 1,
  },
  {
    source: 'Major Subdivision',
    target: 'Staff Review',
    value: 1,
  },
  {
    source: 'Level II',
    target: 'Staff Review',
    value: 1,
  },
  {
    source: 'Level III',
    target: 'Staff Review',
    value: 1,
  },
  {
    source: 'Conditional Zoning',
    target: 'Staff Review',
    value: 1,
  },
  {
    source: 'Conditional Use Permit',
    target: 'Staff Review',
    value: 1,
  },
  {
    source: 'Staff Review',
    target: 'Level I: Accepted',
    value: 1,
  },
  {
    source: 'Staff Review',
    target: 'Level I: Rejected',
    value: 1,
  },
  {
    source: 'Staff Review',
    target: 'Technical Review Committee',
    value: 5,
  }
]

nodes.forEach(node => {
  g.setNode(
    node.id,
    {
      label: node.id,
      width: node.width ? node.width : nodeSize * 0.9,
      height: nodeSize,
      description: node.description,
    }
  );
})

links.forEach(link => {
  g.setEdge(link.source, link.target, { color: 'gray', weight: link.value });
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
      <div style={{ width: '100%', height: nodeSize * 10 }}>
        <ResponsiveNetworkFrame
          size={[1000, 1000]}
          responsiveWidth
          responsiveHeight
          margin={20}
          graph={g}
          networkType={{
            type: 'dagre',
          }}
          customNodeIcon={(d) => {
            const width = d.d.width
            const height = d.d.height;
            return (<g key={`${d.i}-${d.d.id}`}>
              <foreignObject
                style={{
                  x: d.d.x - width / 2,
                  y: d.d.y,
                  width: d.d.width,
                  height: height,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    border: '0.5px solid #e6e6e6',
                    backgroundColor: 'white',
                    fontSize: '0.85em',
                    padding: '0.5em',
                    borderRadius: '2px'
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      fontWeight: 'normal',
                      padding: '0 0 0.5em 0',
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
          edgeStyle={{ stroke: '#e6e6e6', fill: 'none', strokeWidth: 3, }}
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
