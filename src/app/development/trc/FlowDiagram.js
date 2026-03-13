import React from 'react';
import ReactDOM from 'react-dom';
import ArrowDefs from './ArrowDefs';
import LargeNodeWrapper from './LargeNodeWrapper';
import SmallNode from './SmallNode';
import { trcProjectTypes, dagreNodes, dagreLinks } from './textContent';
import { getDagreGraph, getNodes, getLinks } from './utils';

/*
Made with dagre: https://github.com/dagrejs/dagre
*/
class FlowDiagram extends React.Component {
  constructor() {
    super();
    // Find good svg height by first getting a graph with an arbitrary node height, then counting how many levels there are to set a better node height
    // A better way to do this would be to render it, see how tall the nodes are, and set individual node heights based on how tall they would be as rendered
    const firstGraph = getDagreGraph(dagreNodes, dagreLinks, 100);
    const yVals = JSON.parse(JSON.stringify(Object.values(firstGraph._nodes))).map((d) => d.y);
    // How many sets of nodes sharing a y value are there?
    this.numLevels = yVals.filter(
      (value, index, nodeArray) => nodeArray.indexOf(value) === index,
    ).length;

    // Could re-implement splitting of node groups
    // const yValCounts = {};
    // for (const num of yVals) {
    //   yValCounts[num] = yValCounts[num] ? yValCounts[num] + 1 : 1;
    // }
    // const maxPerRow = 3;
    // const multiRow = Object.values(yValCounts).filter(v => v > maxPerRow).length;

    this.updateDimensions = this.updateDimensions.bind(this);

    this.state = {
      dimensions: null,
    };
  }

  updateDimensions() {
    // You will rip the DOM out of my cold, dead hands (jk there's probably a better way to grab the rendered element's dimensions)
    const container = document.getElementById('dagre-container').getBoundingClientRect();
    this.setState({
      dimensions: {
        width: container.width,
        height: container.height,
      },
    });
  }

  componentDidMount() {
    // When window changes size, set dimensions so as to trigger re-render
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  renderContent() {
    const { dimensions } = this.state;
    const height = dimensions.width < 992 ? 3200 : 5800;
    const nodePadding = 5;
    const edgeStroke = dimensions.width < 992 ? 3 : 4;
    const arrowWidth = edgeStroke * 1.5;
    const edgePadding = arrowWidth * 4;
    const nodeHeight = (height - nodePadding * (this.numLevels + 4)) / this.numLevels;
    const yOffset = nodeHeight / 2;

    const graph = getDagreGraph(dagreNodes, dagreLinks, nodeHeight);
    const nodes = getNodes(graph, dimensions.width, nodeHeight, nodePadding);
    const links = getLinks(dagreLinks, nodes, edgePadding, edgeStroke);

    return (
      <div className={`text-xs sm:text-base w-full `}>
        <svg
          height={height}
          width={dimensions.width}
          aria-label="Major development process flow diagram"
        >
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
              const halfWay = d.x1 + (d.x2 - d.x1) / 2;
              const linkYOffset = yOffset - 1;

              const pathData = `M${d.x1} ${d.y1 - linkYOffset}
                Q ${d.x1} ${d.y1 + (d.y2 - d.y1) / 4 - linkYOffset + verticalOffset},
                ${halfWay} ${d.y1 + (d.y2 - d.y1) / 2 - linkYOffset + verticalOffset}
                T ${d.x2} ${d.y2 - linkYOffset}
              `;

              return (
                <path
                  d={pathData}
                  style={{
                    stroke: trcProjectTypes[d.id].color,
                    strokeWidth: edgeStroke,
                    fill: 'none',
                  }}
                  key={`${d.source}-${d.target}-${i}`}
                  className={d.id}
                  markerEnd={`url(#marker-${trcProjectTypes[d.id].short})`}
                />
              );
            })}
          </g>
          <g>
            {nodes.map((d) =>
              dimensions.width > 991 ? (
                <LargeNodeWrapper node={d} yOffset={yOffset} edgeStroke={edgeStroke} key={d.id} />
              ) : (
                <SmallNode node={d} yOffset={yOffset} edgeStroke={edgeStroke} key={d.id} />
              ),
            )}
          </g>
        </svg>
      </div>
    );
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

export default FlowDiagram;
