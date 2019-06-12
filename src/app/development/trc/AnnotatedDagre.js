import React from 'react';
// import PropTypes from 'prop-types';
import dagre from 'dagre';
import TypePuck from './TypePuck';
import CityLogoSvg from '../../../shared/CityLogoSvg';
import Icon from '../../../shared/Icon';
import { trcProjectTypes } from '../utils';
import {
  DRAFTING_COMPASS,
  USER_FRIENDS,
} from '../../../shared/iconConstants';

function getDagreGraph(nodes, links, nodeSize) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'TB',
    ranker: 'network-simplex',
    marginx: 0,
    marginy: 0,
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(
      node.id,
      Object.assign({ width: nodeSize, height: nodeSize }, node),
    );
  });

  links.forEach((link) => {
    g.setEdge(
      link.source,
      link.target,
      {
        parallelEdges: link.parallelEdges,
      }
    );
  });

  dagre.layout(g);

  return g;
}

function getNodes(dagreGraph, visWidth, nodeHeight, nodePadding) {
  const nodeValues = [].concat(Object.values(dagreGraph._nodes));
  const midpointX = visWidth / 2;
  const annotationMargin = nodePadding;

  let totalYOffsetValue = 0;
  // totalYOffsetValue has to be added to if there is a multi-row set of nodes
  nodeValues.forEach((d) => {
    d.coincidents = JSON.parse(JSON.stringify(nodeValues.filter(val => val.y === d.y)));
    d.indexInCoincidents = d.coincidents.findIndex(c => c.id === d.id);
    d.numPerRow = d.coincidents.length <= 3 ? d.coincidents.length : Math.ceil(d.coincidents.length / 2);

    // Could set max width for nodes
    // d.wrap = Math.min(
    //   (visWidth - (annotationMargin + annotationMargin * d.numPerRow)) / d.numPerRow,
    //   450
    // )

    // For now just make it 100%
    d.wrap = (visWidth - (annotationMargin + annotationMargin * d.numPerRow)) / d.numPerRow;

    // Set x value
    const midRowIndex = (d.numPerRow - 1) / 2;
    d.x = midpointX + ((d.indexInCoincidents % d.numPerRow) - midRowIndex) * (annotationMargin + d.wrap);

    // Y value must be set in separate iteration because it is used to determine coincidents
    let thisYOffset = totalYOffsetValue;
    // Split into rows
    // if (d.coincidents.length > 2) {
    //   if (d.indexInCoincidents >= d.coincidents.length / 2) {
    //     thisYOffset = nodeHeight;
    //     if (d.indexInCoincidents % d.numPerRow === 0) {
    //       // If it's a new row
    //       totalYOffsetValue += nodeHeight;
    //     }
    //   }
    // }
    d.yOffset = thisYOffset;
  })
  // Reiterate and update y values
  return nodeValues.map(d => {
    const rVal = Object.assign({}, d);
    rVal.y = d.y + d.yOffset;
    return rVal;
  });
}

function getLinks(inputLinks, nodes, edgePadding, edgeStroke) {
  const linkValues = JSON.parse(JSON.stringify(inputLinks))
    .map((link) => {
      const rObj = Object.assign({}, link);
      // indexInCoincidents should be multiplier for spacing
      // middle index in coincidents should be middle of node
      // total num things leaving node =

      const startNode = nodes.find(node => node.id === link.source);
      const endNode = nodes.find(node => node.id === link.target);
      rObj.startNode = startNode;
      rObj.endNode = endNode;
      rObj.x1 = startNode.x;
      rObj.y1 = startNode.y;
      rObj.x2 = endNode.x;
      rObj.y2 = endNode.y;
      return rObj;
    });

  const withParallelsOnly = linkValues.filter(link => link.parallelEdges);
  const withoutParallels = linkValues.filter(link => !link.parallelEdges);

  withParallelsOnly.forEach((link) => {
    link.parallelEdges.forEach((parallel) => {
      const newLinkVal = Object.assign({}, link);
      newLinkVal.id = parallel.id;
      withoutParallels.push(newLinkVal);
    });
  });

  // Then iterate and reassign x values to all using parallelEdges algorithm
  withoutParallels.forEach((link) => {
    // TODO: also consider it a coincident if its nodes are coincident with one another
    link.x1Coincidents = withoutParallels.filter(otherLink => otherLink.x1 === link.x1 && otherLink.y1 === link.y1);
    link.x1CoincidentIndex = link.x1Coincidents.findIndex(coincident =>
      coincident.source === link.source && coincident.target === link.target && coincident.id === link.id);

    // total number of links entering and leaving node is how spread out they need to be
    link.x2Coincidents = withoutParallels.filter(otherLink => otherLink.x2 === link.x2 && otherLink.y2 === link.y2);
    link.x2CoincidentIndex = link.x2Coincidents.findIndex(coincident =>
      coincident.source === link.source &&
        coincident.target === link.target &&
        coincident.id === link.id);
  });

  return withoutParallels.map((link) => {
    // TODO: grab parallel edges logic to add more padding for parallel edges?
    const rObj = Object.assign({}, link);
    const paddingAndStroke = edgePadding + edgeStroke;
    rObj.x1 = link.x1 + link.x1CoincidentIndex * paddingAndStroke - ((link.x1Coincidents.length - 1) * paddingAndStroke) / 2;
    rObj.x2 = link.x2 + link.x2CoincidentIndex * paddingAndStroke - ((link.x2Coincidents.length - 1) * paddingAndStroke) / 2;;
    return rObj;
  });
}

const displaySubNode = (node, lastNode = false) => (
  <div
    key={node.id}
    style={{ verticalAlign: 'top', padding: `0.5rem ${lastNode ? 0 : '1rem'} 0 0`, flex: 1 }}
  >
    <div style={{ fontSize: '1.25rem', padding: '0 0 1rem 0' }}>{node.id}</div>
    {nodeSteps(node.steps, node.id)}
  </div>
);

const nodeSteps = (steps, nodeId) => (
  <ul style={{ listStyleType: 'none', padding: '0' }}>{Object.keys(steps).map(stepKey => (
    <li key={`${stepKey}-${nodeId}`} style={{ display: 'flex', padding: '0.15rem 0' }}>
      <span
        style={{
          textTransform: 'capitalize',
          padding: '0 2rem 0 0',
          fontWeight: 400,
          minWidth: '5rem',
        }}
      >
        {stepKey}
      </span>
      {stepKey === 'who' && steps.who &&
        <div>
          {steps.who.map(actor => (
            <div key={`${actor}-${nodeId}`}>
              <div
                style={{ padding: '0 0.5rem 0 0', width: '2rem', display: 'inline-block' }}
              >
                {whoIcons[actor].icon}
              </div>
              <span>{whoIcons[actor].label}</span>
            </div>
          ))}
        </div>
      }
      {stepKey !== 'who' && <span>{steps[stepKey]}</span>}
    </li>
  ))}
  </ul>
);

const decisionIconStyle = {
  margin: '0.25rem 1rem 0.25rem 0',
  width: '1.25em',
  color: 'white',
  textAlign: 'center',
  display: 'inline-block',
  borderRadius: '25%',
};

const decisionIconHeader = (
  <div style={{ margin: '0 auto' }}>
    <div>
      <div style={Object.assign({ backgroundColor: '#008A00' }, decisionIconStyle)}>&#10004;</div>
      <span>Approved</span>
    </div>
    <div>
      <div style={Object.assign({ backgroundColor: '#CE3800' }, decisionIconStyle)}>&#10008;</div>
      <span>Denied</span>
    </div>
    <div>
      <div
        style={Object.assign({ backgroundColor: '#3F71C3', fontWeight: 600 }, decisionIconStyle)}
      >
        &#8635;
      </div>
      <span>Revise</span>
    </div>
  </div>
);

const whoIcons = {
  dev: {
    label: 'Developer',
    icon: (<Icon path={DRAFTING_COMPASS} viewBox="0 0 512 512" />),
  },
  staff: {
    label: 'City Staff',
    icon: (<CityLogoSvg color="black" height={16} />),
  },
  neighbors: {
    label: 'Neighbors',
    icon: (<Icon path={USER_FRIENDS} viewBox="0 0 640 512" size={19} />),
  },
};

class AnnotatedDagre extends React.Component {
  constructor() {
    super();
    this.nodes = [
      {
        id: 'Pre-Application',
        subNodes: [
          {
            id: 'Pre-Application Meeting',
            steps: {
              what: 'Developers and city staff meet to review plans, discuss process and schedule, identify applicable regulations.',
              who: ['dev', 'staff'],
              when: 'Required before application submission',
              where: '161 South Charlotte Street',
            },
          },
          {
            id: 'Neighborhood Meeting',
            steps: {
              what: 'Developers must notify all property owners within 200 feet of the proposed development site.  Neighbors meet with developers to collaborate on neighborhood needs and opportunities.',
              who: ['dev', 'neighbors'],
              when: '10 days before application submission',
              where: '???',
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
        id: 'Permit Application',
        steps: {
          what: 'Submission of required plans and documents and payment of application fees.',
          when: 'After the preliminary steps are completed.  Applications that do not indicate that a neighborhood meeting has been held are rejected.',
          who: ['dev'],
          where: 'The City of Asheville Development Services Department',
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
        id: 'Staff Review',
        steps: {
          what: 'A staff member reviews plans for compliance with applicable ordinances and documents and creates a report.',
          when: '',
          who: ['staff'],
          where: '',
        },
        typeIds: [
          'Level I',
        ],
      },
      {
        id: 'Level I Decision',
        description: <div>{decisionIconHeader}</div>,
        typeIds: [
          'Level I',
        ],
      },
      {
        id: 'Technical Review Committee',
        steps: {
          what: 'An eight-member body that ensures that the proposed project complies with standards and requirements.  The committee consists of six staff, a representative of the Tree Commission and a member representing the Buncombe County Metropolitan Sewerage District (MSD).',
          when: '',
          who: ['dev', 'staff'],
          where: '',
        },
        typeIds: [
          'Level II',
          'Major Subdivision',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'Major Subdivision and Level II Decision (Not Downtown)',
        description: <div>{decisionIconHeader}</div>,
        typeIds: [
          'Level II',
          'Major Subdivision',
        ],
      },
      {
        id: 'Design Review',
        description: <div>Projects located Downtown or in the River District must be reviewed for architectural design elements by a special design review sub-committee of either the <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTIIIDEKIADADBO_S7-3-8ASDOCO" target="_blank" rel="noopener noreferrer">Asheville Downtown Commission</a> or the <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTIIIDEKIADADBO_S7-3-10ASARRIRECO" target="_blank" rel="noopener noreferrer">Asheville Area Riverfront Redevelopment Commission</a> prior to approval.</div>,
        steps: {
          what: '',
          when: '',
          where: '',
          who: ['dev', 'staff', 'neighbors'],
        },
        typeIds: [
          'Level II',
        ],
      },
      {
        id: 'Planning and Zoning Commission',
        steps: {
          what: 'Conditional Zoning, Level III, Conditional Use Permits and Level II projects within the Downtown area are reviewed by the Planning & Zoning Commission.  For  Conditional Zoning, Use and Level III projects, the Planning & Zoning Commission holds a public hearing and makes a recommendation for action to City Council.  For downtown Level II projects, the Planning & Zoning Commission verifies technical compliance with the requirements of applicable ordinances and documents and takes final action.',
          when: '',
          who: '',
          where: '',
        },
        typeIds: [
          'Level II',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'Level II and Downtown Major Subdivision Decision',
        description: <div>{decisionIconHeader}</div>,
        typeIds: [
          'Level II',
          'Major Subdivision',
        ],
      },
      {
        id: 'City Council',
        description: 'Conditional Zoning, Level III, Conditional Use Permits are reviewed during a public hearing before City Council.  These projects arrive at the City Council meeting with a recommendation for action that has been sent by the Planning & Zoning Commission.',
        steps: {
          what: '',
          when: '',
          where: '',
          who: ['dev', 'staff', 'neighbors'],
        },
        typeIds: [
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'City Council Decision',
        description: <div>{decisionIconHeader}</div>,
        typeIds: [
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
    ];
    this.links = [
      {
        source: 'Pre-Application',
        target: 'Permit Application',
        parallelEdges: [
          { id: 'Major Subdivision' },
          { id: 'Level II' },
          { id: 'Conditional Zoning' },
          { id: 'Conditional Use Permit' },
        ],
      },
      {
        source: 'Permit Application',
        target: 'Staff Review',
        parallelEdges: [
          { id: 'Level I' },
        ],
      },
      {
        source: 'Permit Application',
        target: 'Technical Review Committee',
        parallelEdges: [
          // { id: 'Level I' },
          { id: 'Major Subdivision' },
          { id: 'Level II' },
          { id: 'Conditional Zoning' },
          { id: 'Conditional Use Permit' },
        ],
      },
      {
        source: 'Staff Review',
        target: 'Level I Decision',
        id: 'Level I',
      },
      {
        source: 'Technical Review Committee',
        target: 'Major Subdivision and Level II Decision (Not Downtown)',
        parallelEdges: [
          { id: 'Major Subdivision' },
          { id: 'Level II' },
        ],
      },
      {
        source: 'Design Review',
        target: 'Planning and Zoning Commission',
        parallelEdges: [
          { id: 'Level II' },
        ],
      },
      {
        source: 'Technical Review Committee',
        target: 'Design Review',
        parallelEdges: [
          { id: 'Level II' },
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
        target: 'Level II and Downtown Major Subdivision Decision',
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
        target: 'City Council Decision',
        parallelEdges: [
          { id: 'Conditional Zoning' },
          { id: 'Conditional Use Permit' },
        ],
      },
    ];
    // Find good node height
    const maxPerRow = 3;
    const firstGraph = getDagreGraph(this.nodes, this.links, 100);
    const yVals = JSON.parse(JSON.stringify(Object.values(firstGraph._nodes)))
      .map(d => d.y);
    const yValCounts = {};
    for (let i = 0; i < yVals.length; i++) {
      const num = yVals[i];
      yValCounts[num] = yValCounts[num] ? yValCounts[num] + 1 : 1;
    }
    const multiRow = Object.values(yValCounts).filter(v => v > maxPerRow).length;
    const uniqueYVals = yVals.filter((value, index, nodeArray) =>
      nodeArray.indexOf(value) === index).length;
    this.numLevels = multiRow + uniqueYVals;

    this.updateDimensions = this.updateDimensions.bind(this);

    this.state = {
      dimensions: null,
    };
  }

  updateDimensions() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      },
    });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  renderContent() {
    const { dimensions } = this.state;
    const visWidth = dimensions.width;
    const height = visWidth < 768 ? 4500 : 4000;
    const nodePadding = 5;
    const edgeStroke = visWidth < 768 ? 3 : 4;
    const arrowWidth = edgeStroke * 1.5;
    const edgePadding = arrowWidth * 4;
    const nodeHeight = (height - nodePadding * (this.numLevels +  4)) / this.numLevels;
    const puckSize = visWidth < 500 ? 16 : 30;
    const yOffset = nodeHeight / 2;

    const graph = getDagreGraph(this.nodes, this.links, nodeHeight);
    const nodes = getNodes(graph, visWidth, nodeHeight, nodePadding);
    const links = getLinks(this.links, nodes, edgePadding, edgeStroke);

    // If any node in the past had a high enough coincidents number that it had to be moved, add to y value for remaining
    return (<div style={{ width: '100%', fontSize: visWidth < 500 ? '0.75rem' : '1em' }}>
      <svg height={height} width={visWidth}>
        <defs>
          {Object.values(trcProjectTypes).map(type => (
            <marker id={`marker-${type.short}`} markerWidth={arrowWidth} markerHeight={arrowWidth} refX={arrowWidth * 2 / 3} refY={arrowWidth / 2} orient="auto" markerUnits="strokeWidth">
              <path d={`M0,0 L0,${arrowWidth} L${arrowWidth * 2 / 3},${arrowWidth / 2} z`} fill={type.color} />
            </marker>
          ))}
        </defs>
        <g>
          {links.map((d, i, linksArray) => {
            const elbowOffset = edgeStroke;
            let verticalOffset = 0;
            if (d.x2 < d.x1) {
              verticalOffset = i * elbowOffset;
            } else if (d.x2 > d.x1) {
              verticalOffset = (linksArray.length - i) * elbowOffset;
            }
            const halfWay = d.x1 + (d.x2 - d.x1) / 2;
            const linkYOffset = yOffset - 1;

            const pathData = `M${d.x1} ${d.y1 - linkYOffset}
              Q ${d.x1} ${d.y1 + ((d.y2 - d.y1) / 4) - linkYOffset + verticalOffset},
              ${halfWay} ${d.y1 + ((d.y2 - d.y1) / 2) - linkYOffset + verticalOffset}
              T ${d.x2} ${d.y2 - linkYOffset}
            `;

            return (<path
              d={pathData}
              style={{
                stroke: trcProjectTypes[d.id].color,
                strokeWidth: edgeStroke,
                fill: 'none',
              }}
              key={`${d.source}-${d.target}-${i}`}
              className={d.id}
              marker-end={`url(#marker-${trcProjectTypes[d.id].short})`}
            />)
          })}
        </g>
        <g>
          {nodes.map(d => (
            <foreignObject
              x={d.x - (d.wrap / 2)}
              y={d.y - yOffset}
              width={d.wrap}
              height={d.height}
              key={`node-${d.id}`}
              style={{ overflow: 'visible' }}
            >
              <div
                style={{
                  border: `${edgeStroke}px solid #e6e6e6`,
                  backgroundColor: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 0 0.25rem',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 400,
                      textAlign: 'left',
                      fontSize: '1.5rem',
                    }}
                  >
                    {d.id}
                  </div>
                  <div>
                    {d.typeIds.map(id =>
                      (<TypePuck
                        key={`${d.id}-puck-${id}`}
                        typeObject={trcProjectTypes[id]}
                        size={puckSize}
                      />)
                    )}
                  </div>
                </div>
                {!d.subNodes && d.steps && nodeSteps(d.steps, d.id)}
                {!d.subNodes && !d.steps && d.description}
                {d.subNodes && (<div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {d.subNodes.map((sub, subIndex, subNodeArray) =>
                    displaySubNode(sub, subIndex === subNodeArray.length - 1))}
                </div>)}
              </div>
            </foreignObject>
          ))}
        </g>
      </svg>
    </div>);
  }

  render() {
    const { dimensions } = this.state;

    return (
      <div ref={(el) => { this.container = el; }} style={{ height: '100%', width: '100%' }}>
        {dimensions && this.renderContent()}
      </div>
    );
  }
}

export default AnnotatedDagre;
