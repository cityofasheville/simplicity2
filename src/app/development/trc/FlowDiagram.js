import React from 'react';
import ReactDOM from 'react-dom';
import ArrowDefs from './ArrowDefs';
import LargeNodeContents from './LargeNodeContents';
import LargeNodeWrapper from './LargeNodeWrapper';
import SmallNode from './SmallNode';
import {
  trcProjectTypes,
  dagreNodes,
  dagreLinks,
} from './textContent';
import {
  getDagreGraph,
  getNodes,
  getLinks,
} from './utils';

/*
Made with dagre: https://github.com/dagrejs/dagre
*/
class FlowDiagram extends React.Component {
  constructor() {
    super();
    // Find good node height
    // const maxPerRow = 3;
    const firstGraph = getDagreGraph(dagreNodes, dagreLinks, 100);
    const yVals = JSON.parse(JSON.stringify(Object.values(firstGraph._nodes)))
      .map(d => d.y);
    const yValCounts = {};
    for (const num of yVals) {
      yValCounts[num] = yValCounts[num] ? yValCounts[num] + 1 : 1;
    }
    // Could re-implement splitting of node groups
    // const multiRow = Object.values(yValCounts).filter(v => v > maxPerRow).length;

    this.numLevels = yVals.filter((value, index, nodeArray) =>
      nodeArray.indexOf(value) === index).length;
    this.updateDimensions = this.updateDimensions.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.state = {
      dimensions: null,
      modalNode: null,
      modalY: 0,
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

  showModal(e, node) {
    this.setState({
      modalNode: node,
      modalY: e.target.getBoundingClientRect().y + window.scrollY,
    });
  }

  hideModal() {
    this.setState({ modalNode: null });
  }

  renderContent() {
    const { dimensions } = this.state;
    const height = dimensions.width < 768 ? 2750 : 5000;
    const nodePadding = 5;
    const edgeStroke = dimensions.width < 768 ? 3 : 4;
    const arrowWidth = edgeStroke * 1.5;
    const edgePadding = arrowWidth * 4;
    const nodeHeight = (height - (nodePadding * (this.numLevels + 4))) / this.numLevels;
    const yOffset = nodeHeight / 2;

    const graph = getDagreGraph(dagreNodes, dagreLinks, nodeHeight);
    const nodes = getNodes(graph, dimensions.width, nodeHeight, nodePadding);
    const links = getLinks(dagreLinks, nodes, edgePadding, edgeStroke);

    return (
      <div
        style={{
          width: '100%',
          fontSize: dimensions.width < 500 ? '0.75rem' : '1em',
          opacity: this.state.modalNode ? '0.5' : '1',
        }}
      >
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
            {nodes.map(d => (dimensions.width > 767 ? (
              <LargeNodeWrapper
                node={d}
                yOffset={yOffset}
                edgeStroke={edgeStroke}
                key={d.id}
              />
            ) : (
              <SmallNode
                node={d}
                yOffset={yOffset}
                edgeStroke={edgeStroke}
                key={d.id}
                clickAction={this.showModal}
              />
            )
            ))}
          </g>
        </svg>
        {this.state.modalNode &&
          ReactDOM.createPortal(
            (<div
              role="status"
              style={{
                position: 'absolute',
                top: this.state.modalY,
                left: '5vw',
                zIndex: 99,
                width: '90vw',
              }}
            >
              <LargeNodeContents
                node={this.state.modalNode}
                yOffset={yOffset}
                edgeStroke={edgeStroke}
                modalCloseFunc={this.hideModal}
              />
            </div>),
            document.body
          )
        }
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
