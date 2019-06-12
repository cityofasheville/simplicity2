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
  dagreNodes,
  dagreLinks,
  decisionIconHeader,
} from './dagreUtils';

class AnnotatedDagre extends React.Component {
  constructor() {
    super();
    // Find good node height
    const maxPerRow = 3;
    const firstGraph = getDagreGraph(dagreNodes, dagreLinks, 100);
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
    const nodeHeight = (height - (nodePadding * (this.numLevels + 4))) / this.numLevels;
    const puckSize = visWidth < 500 ? 16 : 30;
    const yOffset = nodeHeight / 2;

    const graph = getDagreGraph(dagreNodes, dagreLinks, nodeHeight);
    const nodes = getNodes(graph, visWidth, nodeHeight, nodePadding);
    const links = getLinks(dagreLinks, nodes, edgePadding, edgeStroke);

    console.log(nodes)

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
              refX={arrowWidth * (2 / 3)}
              refY={arrowWidth / 2}
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d={`M0,0 L0,${arrowWidth} L${arrowWidth * (2 / 3)},${arrowWidth / 2} z`}
                fill={type.color}
              />
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
            const halfWay = d.x1 + ((d.x2 - d.x1) / 2);
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
