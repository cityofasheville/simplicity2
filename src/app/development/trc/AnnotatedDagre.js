import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import TypePuck from './TypePuck';
import { trcProjectTypes } from '../utils';


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
      {
        id: node.id,
        width: nodeSize,
        height: nodeSize,
        description: node.description,
        typeIds: node.typeIds,
      }
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
    d.wrap = Math.min(
      (visWidth - (annotationMargin + annotationMargin * d.numPerRow)) / d.numPerRow,
      450
    )

    // Set x value
    const midRowIndex = (d.numPerRow - 1) / 2;
    d.x = midpointX + ((d.indexInCoincidents % d.numPerRow) - midRowIndex) * (annotationMargin + d.wrap);

    // Y value must be set in separate iteration because it is used to determine coincidents
    let thisYOffset = totalYOffsetValue;
    // Split into rows
    if (d.coincidents.length > 2) {
      if (d.indexInCoincidents >= d.coincidents.length / 2) {
        thisYOffset = nodeHeight;
        if (d.indexInCoincidents % d.numPerRow === 0) {
          // If it's a new row
          totalYOffsetValue += nodeHeight;
        }
      }
    }
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
    .map(link => {
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
    })

  const withParallelsOnly = linkValues.filter(link => link.parallelEdges);
  const withoutParallels = linkValues.filter(link => !link.parallelEdges);

  withParallelsOnly.forEach(link => {
    link.parallelEdges.forEach((parallel, i) => {
      const newLinkVal = Object.assign({}, link);
      newLinkVal.id = parallel.id;
      withoutParallels.push(newLinkVal);
    })
  })

  // Then iterate and reassign x values to all using parallelEdges algorithm
  withoutParallels.forEach(link => {
    // TODO: also consider it a coincident if its nodes are coincident with one another
    link.x1Coincidents = withoutParallels.filter(otherLink => otherLink.x1 === link.x1 && otherLink.y1 === link.y1);
    link.x1CoincidentIndex = link.x1Coincidents.findIndex(coincident =>
      coincident.source === link.source && coincident.target === link.target && coincident.id === link.id);

    // total number of links entering and leaving node is how spread out they need to be
    link.x2Coincidents = withoutParallels.filter(otherLink => otherLink.x2 === link.x2 && otherLink.y2 === link.y2);
    link.x2CoincidentIndex = link.x2Coincidents.findIndex(coincident =>
      coincident.source === link.source && coincident.target === link.target && coincident.id === link.id);
  })

  return withoutParallels.map(link => {
    // TODO: grab parallel edges logic to add more padding for parallel edges?
    const rObj = Object.assign({}, link);
    const paddingAndStroke = edgePadding + edgeStroke;
    rObj.x1 = link.x1 + link.x1CoincidentIndex * paddingAndStroke - ((link.x1Coincidents.length - 1) * paddingAndStroke) / 2;
    rObj.x2 = link.x2 + link.x2CoincidentIndex * paddingAndStroke - ((link.x2Coincidents.length - 1) * paddingAndStroke) / 2;;
    return rObj;
  });
}

class AnnotatedDagre extends React.Component {
  constructor() {
    super();
    this.nodes = [
      {
        id: 'Neighborhood Meeting',
        description: 'The developer must arrange a neighborhood meeting and invite property owners within 200 feet of the proposed development. The meeting must be no more than four months but at least ten days before application submission. At least ten days prior to the meeting, property must be posted and notice of the meeting mailed.',
        typeIds: [
          // 'Level I',
          'Level II',
          'Major Subdivision',
          'Level III',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'Pre-Application Meeting',
        description: 'The developer must meet with city staff at a pre-application meeting.',
        typeIds: [
          // 'Level I',
          'Level II',
          'Major Subdivision',
          'Level III',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'Permit Application',
        description: 'Developer submits permit application.',
        typeIds: [
          'Level I',
          'Level II',
          'Major Subdivision',
          'Level III',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'Staff Review',
        description: 'Staff from various technical disciplines review plans for compliance with applicable ordinances and documents and create a staff report.',
        typeIds: [
          'Level I',
          'Level II',
          'Major Subdivision',
          'Level III',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'Level I Decision',
        description: 'When plans for a Level I scale project show that all technical requirements are met, staff must approve the plans and issue a permit.',
        typeIds: [
          'Level I',
        ],
      },
      {
        id: 'Technical Review Committee',
        description: 'An eight-member body that ensures that the proposed project complies with standards and requirements.  The committee consists of six staff, a representative of the Tree Commission and a member representing the Buncombe County Metropolitan Sewerage District (MSD).',
        typeIds: [
          // 'Level I',
          'Level II',
          'Major Subdivision',
          'Level III',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'Major Subdivision and Level II Decision (Not Downtown)',
        description: 'When plans for a Major Subdivision or Level II review that is not located downtown show that all technical requirements are met, staff must approve the plans and issue a permit.  For Major Subdivisions and Leve lII projects that are not in a special Zoning district such as the Downtown area, the Technical Review Committee (TRC) must approve compliant plans or reject deficient plans.',
        typeIds: [
          // 'Level I',
          'Level II',
          'Major Subdivision',
          // 'Level III',
          // 'Conditional Zoning',
          // 'Conditional Use Permit',
        ],
      },
      {
        id: 'Design Review',
        description: <div>Projects located Downtown or in the River District must be reviewed for architectural design elements by a special design review sub-committee of either the <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTIIIDEKIADADBO_S7-3-8ASDOCO" target="_blank" rel="noopener noreferrer">Asheville Downtown Commission</a> or the <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTIIIDEKIADADBO_S7-3-10ASARRIRECO" target="_blank" rel="noopener noreferrer">Asheville Area Riverfront Redevelopment Commission</a> prior to approval.</div>,
        typeIds: [
          // 'Level I',
          'Level II',
          // 'Major Subdivision',
          'Level III',
          // 'Conditional Zoning',
          // 'Conditional Use Permit',
        ],
      },
      {
        id: 'Planning and Zoning Commission',
        description: 'Conditional Zoning, Level III, Conditional Use Permits and Level II projects within the Downtown area are reviewed by the Planning & Zoning Commission.  For  Conditional Zoning, Use and Level III projects, the Planning & Zoning Commission holds a public hearing and makes a recommendation for action to City Council.  For downtown Level II projects, the Planning & Zoning Commission verifies technical compliance with the requirements of applicable ordinances and documents and takes final action.',
        typeIds: [
          // 'Level I',
          'Level II',
          // 'Major Subdivision',
          'Level III',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'Level II and Downtown Major Subdivision Decision',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        typeIds: [
          // 'Level I',
          'Level II',
          'Major Subdivision',
          // 'Level III',
          // 'Conditional Zoning',
          // 'Conditional Use Permit',
        ],
      },
      {
        id: 'City Council',
        description: 'Conditional Zoning, Level III, Conditional Use Permits are reviewed during a public hearing before City Council.  These projects arrive at the City Council meeting with a recommendation for action that has been sent by the Planning & Zoning Commission.',
        typeIds: [
          // 'Level I',
          // 'Level II',
          // 'Major Subdivision',
          'Level III',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
      {
        id: 'City Council Decision',
        description: 'City Council hears evidence and testimony and takes final action on the application by vote.',
        typeIds: [
          // 'Level I',
          // 'Level II',
          // 'Major Subdivision',
          'Level III',
          'Conditional Zoning',
          'Conditional Use Permit',
        ],
      },
    ]
    this.links = [
      {
        source: 'Neighborhood Meeting',
        target: 'Permit Application',
        parallelEdges: [
          { id: 'Major Subdivision' },
          { id: 'Level II' },
          { id: 'Level III' },
          { id: 'Conditional Zoning'},
          { id: 'Conditional Use Permit' },
        ]
      },
      {
        source: 'Pre-Application Meeting',
        target: 'Permit Application',
        parallelEdges: [
          { id: 'Major Subdivision' },
          { id: 'Level II' },
          { id: 'Level III' },
          { id: 'Conditional Zoning'},
          { id: 'Conditional Use Permit' },
        ]
      },
      {
        source: 'Permit Application',
        target: 'Staff Review',
        parallelEdges: [
          { id: 'Level I' },
          { id: 'Major Subdivision' },
          { id: 'Level II' },
          { id: 'Level III' },
          { id: 'Conditional Zoning'},
          { id: 'Conditional Use Permit' },
        ]
      },
      {
        source: 'Staff Review',
        target: 'Level I Decision',
        id: 'Level I',
      },
      {
        source: 'Staff Review',
        target: 'Technical Review Committee',
        parallelEdges: [
          { id: 'Major Subdivision' },
          { id: 'Level II' },
          { id: 'Level III' },
          { id: 'Conditional Zoning'},
          { id: 'Conditional Use Permit' },
        ]
      },
      {
        source: 'Technical Review Committee',
        target: 'Major Subdivision and Level II Decision (Not Downtown)',
        id: 'Major Subdivision',
      },
      {
        source: 'Design Review',
        target: 'Planning and Zoning Commission',
        parallelEdges: [
          { id: 'Level II' },
        ]
      },
      {
        source: 'Technical Review Committee',
        target: 'Planning and Zoning Commission',
        parallelEdges: [
          { id: 'Level III' },
          { id: 'Conditional Zoning'},
          { id: 'Conditional Use Permit' },
        ]
      },
      {
        source: 'Technical Review Committee',
        target: 'Design Review',
        // All level II, downtown subdivisions, and special district L3 etc go to desgin review?
        parallelEdges: [
          { id: 'Level II' },
        ]
      },
      {
        source: 'Planning and Zoning Commission',
        target: 'Level II and Downtown Major Subdivision Decision',
        parallelEdges: [
          { id: 'Level II' },
        ]
      },
      {
        source: 'Planning and Zoning Commission',
        target: 'City Council',
        parallelEdges: [
          { id: 'Level III' },
          { id: 'Conditional Zoning'},
          { id: 'Conditional Use Permit' },
        ]
      },
      {
        source: 'City Council',
        target: 'City Council Decision',
        parallelEdges: [
          { id: 'Level III' },
          { id: 'Conditional Zoning'},
          { id: 'Conditional Use Permit' },
        ]
      },
    ];
    // Find good node height
    const maxPerRow = 3;
    const firstGraph = getDagreGraph(this.nodes, this.links, 100);
    const yVals = JSON.parse(JSON.stringify(Object.values(firstGraph._nodes)))
      .map(d => d.y);
    const yValCounts = {};
    for (let i = 0; i < yVals.length; i++) {
      let num = yVals[i];
      yValCounts[num] = yValCounts[num] ? yValCounts[num] + 1 : 1;
    }
    const multiRow = Object.values(yValCounts).filter(v => v > maxPerRow).length;
    const uniqueYVals = yVals.filter(
      (value, index, nodeArray) => nodeArray.indexOf(value) === index
    ).length;
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
    // use class instead/in addition to color? highlight all links with that class when a node is hovered?
    // highlight all links and nodes when a link is hovered?
    const { dimensions } = this.state;
    const visWidth = dimensions.width;
    const height = visWidth < 768 ? 4500 : 4000;
    const nodePadding = 5;
    const edgePadding = 6;
    const edgeStroke = 3;
    const nodeHeight = (height - nodePadding * (this.numLevels +  4)) / this.numLevels;
    const puckSize = visWidth < 500 ? 20 : 50;
    const yOffset = nodeHeight / 2;

    const graph = getDagreGraph(this.nodes, this.links, nodeHeight);
    const nodes = getNodes(graph, visWidth, nodeHeight, nodePadding);
    const links = getLinks(this.links, nodes, edgePadding, edgeStroke);

    // If any node in the past had a high enough coincidents number that it had to be moved, add to y value for remaining
    return (<div style={{ width: '100%', fontSize: visWidth < 500 ? '0.75rem' : '1em' }}>
      <svg height={height} width={visWidth}>
        <g>
          {links.map((d, i) => {
            // TODO: go get elbow logic from old commit
            return (<path
              d={`M${d.x1} ${d.y1 - yOffset}
                L${d.x1} ${d.y1 + ((d.y2 - d.y1) / 3) - yOffset}
                L${d.x2} ${d.y1 + ((d.y2 - d.y1) / 3) * 2 - yOffset}
                L${d.x2} ${d.y2 - yOffset}`}
              style={{
                stroke: trcProjectTypes[d.id].color,
                strokeWidth: edgeStroke,
                fill: 'none',
              }}
              key={`${d.source}-${d.target}-${i}`}
              className={d.id}
            />)
          })}
        </g>
        <g>
          {nodes.map(d => (
            <foreignObject
              x={d.x - d.wrap / 2}
              y={d.y - yOffset}
              width={d.wrap}
              height={d.height}
              key={`node-${d.id}`}
              style={{ overflow: 'visible' }}
            >
              <div
                style={{
                  border: '2px solid #e6e6e6',
                  backgroundColor: 'white',
                  padding: '1em',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '0.5em 0'
                  }}
                >
                  {d.id}
                </div>
                <div style={{ textAlign: 'center' }}>
                  {d.typeIds.map(id =>
                    <TypePuck
                      key={`${d.id}-puck-${id}`}
                      typeObject={trcProjectTypes[id]}
                      size={puckSize}
                    />
                  )}
                </div>
                {d.description}
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
      <div ref={el => (this.container = el)} style={{ height: '100%', width: '100%' }}>
        {dimensions && this.renderContent()}
      </div>
    );
  }

}

export default AnnotatedDagre;
