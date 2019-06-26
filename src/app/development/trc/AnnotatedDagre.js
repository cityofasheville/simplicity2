import React from 'react';
// import PropTypes from 'prop-types';
import TypePuck from './TypePuck';
import { trcProjectTypes } from '../utils';
import ArrowDefs from './ArrowDefs';
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
    const container = document.getElementById('dagre-container').getBoundingClientRect();
    this.setState({
      dimensions: {
        width: container.width,
        height: container.height,
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
    const height = dimensions.width < 768 ? 5500 : 5000;
    const nodePadding = 5;
    const edgeStroke = dimensions.width < 768 ? 3 : 4;
    const arrowWidth = edgeStroke * 1.5;
    const edgePadding = arrowWidth * 4;
    const nodeHeight = (height - (nodePadding * (this.numLevels + 4))) / this.numLevels;
    const puckSize = dimensions.width < 500 ? 14 : 25;
    const yOffset = nodeHeight / 2;

    const graph = getDagreGraph(dagreNodes, dagreLinks, nodeHeight);
    const nodes = getNodes(graph, dimensions.width, nodeHeight, nodePadding);
    const links = getLinks(dagreLinks, nodes, edgePadding, edgeStroke);


    // Render diagram to fake dom, then update node sizes based on that?

    // If any node in the past had a high enough coincidents number that it had to be moved, add to y value for remaining
    return (<div style={{ width: '100%', fontSize: dimensions.width < 500 ? '0.75rem' : '1em' }}>
      <svg height={height} width={dimensions.width}>
        <ArrowDefs arrowWidth={arrowWidth} />
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
                  padding: '0.5rem 0.75rem',
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
                      fontSize: '1.15rem',
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

                {d.content}

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
      <div id="dagre-container" style={{ height: '100%', width: '100%' }}>
        {dimensions && this.renderContent()}
      </div>
    );
  }
}

export default AnnotatedDagre;
