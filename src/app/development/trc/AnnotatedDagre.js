import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import TypePuck from './TypePuck';
import { trcProjectTypes } from '../utils';


function getDagreGraph(nodes, links, nodeSize, nodePadding) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'TB',
    ranker: 'network-simplex',
    marginx: nodePadding,
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
  const nodeValues = JSON.parse(JSON.stringify(Object.values(dagreGraph._nodes)));
  const midpointX = visWidth / 2;
  const annotationMargin = nodePadding * 2;

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
        description: 'When plans for a Level I scale project show that all technical requirements are met, staff approves the plans and issues a permit.',
        typeIds: [
          'Level I',
          // 'Level II',
          // 'Major Subdivision',
          // 'Level III',
          // 'Conditional Zoning',
          // 'Conditional Use Permit',
        ],
      },
      {
        id: 'Technical Review Committee',
        description: 'An eight-member body that ensures that the proposed project complies with standards and requirements. Consists of six staff, a representative of the Tree Commission, and a member representing the Buncombe County Metropolitan Sewer District (MSD).',
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
        id: 'Major Subdivision Decision',
        description: 'When plans for a Major Subdivision or non-downtown Level II scale project show that all technical requirements are met, staff approves the plans and issues a permit.  For major subdivisions and Level II projects that are not in a special zoning area like downtown, the Technical Review Committee is the body that either accepts or rejects the proposal.',
        typeIds: [
          // 'Level I',
          // 'Level II',
          'Major Subdivision',
          // 'Level III',
          // 'Conditional Zoning',
          // 'Conditional Use Permit',
        ],
      },
      {
        id: 'Design Review',
        description: 'All downtown level II, downtown subdivisions, and special zoning district Level III go to desgin review. The decision made in this step is a a non-binding recommendation.',
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
        description: 'The Commission consists of 7 members, 5 City residents appointed by City Council and 2 residents of the extra-territorial area of the City and appointed by Buncombe County Commissioners.  The commission approves downtown Level II projects and holds public hearings for conditional zoning and conditional use permits and makes a recommendation for action to city council.',
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
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
        target: 'Major Subdivision Decision',
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
    const firstGraph = getDagreGraph(this.nodes, this.links, 100, 0);
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
  }

  render() {
    // TODO: USE REF TO GET CONTAINER SIZE INSTEAD
    // use class instead/in addition to color? highlight all links with that class when a node is hovered?
    // highlight all links and nodes when a link is hovered?
    const visWidth = 900;
    const height = visWidth < 768 ? 4000 : 3500;
    const nodePadding = 10;
    const edgePadding = 10;
    const edgeStroke = 5;
    const nodeHeight = (height - nodePadding * (this.numLevels + 1)) / (this.numLevels + 1);

    const graph = getDagreGraph(this.nodes, this.links, nodeHeight, nodePadding);
    const nodes = getNodes(graph, visWidth, nodeHeight, nodePadding);
    const links = getLinks(this.links, nodes, edgePadding, edgeStroke);

    // If any node in the past had a high enough coincidents number that it had to be moved, add to y value for remaining
    return (<div style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', flexWrap: 'wrap' }}>
        {Object.keys(trcProjectTypes).map(type => {
          const projectType = trcProjectTypes[type];
          return (
            <div
              key={`card-${type}`}
              style={{
                width: '25%',
                flexGrow: 1,
                border: `5px solid ${projectType.color}`,
                backgroundColor: 'white',
                padding: '1em',
                borderRadius: '6px',
                margin: '1em',
                top: '0px',
              }}
              className={type}
            >
              <div style={{ textAlign: 'center' }}>
                <TypePuck
                  color={projectType.color}
                  text={projectType.short}
                />
              </div>
              <div
                style={{
                  width: '100%',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: '0.5em 0'
                }}
              >
                {type}
              </div>
              <div>{projectType.description}</div>
            </div>
          )
        })}
      </div>
      <svg height={height} width={visWidth}>
        <g>
          {links.map((d, i) => {
            // TODO: go get elbow logic from old commit
            return (<path
              d={`M${d.x1} ${d.y1}
                L${d.x1} ${d.y1 + ((d.y2 - d.y1) / 3)}
                L${d.x2} ${d.y1 + ((d.y2 - d.y1) / 3) * 2}
                L${d.x2} ${d.y2}`}
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
              x={d.x - d.width / 2}
              y={d.y - d.height / 4}
              width={d.width}
              height={d.height}
              key={`node-${d.id}`}
            >
              <div
                style={{
                  border: `2px solid ${trcProjectTypes[d.id] ? trcProjectTypes[d.id].color : '#e6e6e6'}`,
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
                >{d.id}</div>
                <div style={{ textAlign: 'center' }}>
                  {d.typeIds.map(id =>
                    <TypePuck
                      key={`${d.id}-puck-${id}`}
                      color={trcProjectTypes[id].color}
                      text={trcProjectTypes[id].short}
                    />
                  )}
                </div>
                <span>{d.description}</span>
              </div>
            </foreignObject>
          ))}
        </g>
      </svg>
    </div>);
  }

}

export default AnnotatedDagre;
