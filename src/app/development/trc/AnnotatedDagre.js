import React from 'react';
// import PropTypes from 'prop-types';
import TypePuck from './TypePuck';
import { trcProjectTypes } from '../utils';
import {
  getDagreGraph,
  getNodes,
  getLinks,
  displaySubNode,
  nodeSteps,
  whoIcons,
  decisionIconHeader,
} from './dagreUtils'


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
            <marker
              key={`marker-${type.short}`}
              id={`marker-${type.short}`}
              markerWidth={arrowWidth}
              markerHeight={arrowWidth}
              refX={arrowWidth * 2 / 3}
              refY={arrowWidth / 2}
              orient="auto"
              markerUnits="strokeWidth"
            >
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
              markerEnd={`url(#marker-${trcProjectTypes[d.id].short})`}
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
