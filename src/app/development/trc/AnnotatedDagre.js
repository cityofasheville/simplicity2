import React from 'react';
import ReactDOM from 'react-dom';
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


const LargeNodeContents = ({ node, yOffset, edgeStroke, modalCloseFunc = null }) => {
  let content;
  if (node.subNodes) {
    content = (<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {node.subNodes.map((sub, subIndex, subNodeArray) =>
        displaySubNode(sub, subIndex === subNodeArray.length - 1))}
    </div>)
  } else if (node.decisionNode) {
    content = <div>{decisionIconHeader}</div>;
  } else if (!node.subNodes && node.steps) {
    content = nodeSteps(node.steps, node.id);
  }

  return (
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
          {node.id}
        </div>
        <div>
          {node.typeIds.map(id =>
            (<TypePuck
              key={`${node.id}-puck-${id}`}
              typeObject={trcProjectTypes[id]}
              size={25}
            />)
          )}
        </div>
      </div>
      {content}
      {modalCloseFunc &&
        <button
          style={{
            borderRadius: '6px',
            textDecoration: 'underline',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            width: '100%',
          }}
          onClick={modalCloseFunc}
        >
          Close
        </button>
      }
    </div>
)}

const LargeNode = ({ node, yOffset, edgeStroke }) => {
  let content;
  if (node.subNodes) {
    content = (<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {node.subNodes.map((sub, subIndex, subNodeArray) =>
        displaySubNode(sub, subIndex === subNodeArray.length - 1))}
    </div>)
  } else if (node.decisionNode) {
    content = <div>{decisionIconHeader}</div>;
  } else if (!node.subNodes && node.steps) {
    content = nodeSteps(node.steps, node.id);
  }

  return (<foreignObject
    x={node.x - (node.wrap / 2)}
    y={node.y - yOffset}
    width={node.wrap}
    height={node.height}
    key={`node-${node.id}`}
    style={{ overflow: 'visible' }}
  >
    <LargeNodeContents node={node} yOffset={yOffset} edgeStroke={edgeStroke} />
  </foreignObject>
)};

const SmallNode = ({ node, yOffset, edgeStroke, clickAction }) => {
  let content;
  if (node.subNodes) {
    content = (<div>
      {node.subNodes.map((sub, subIndex, subNodeArray) =>
        <div style={{ padding: subIndex > 0 ? '1rem 0 0' : 0 }} key={sub.id}>{sub.id}: {sub.steps.what}</div>)}
    </div>)
  } else if (node.decisionNode) {
    content = <div>{decisionIconHeader}</div>;
  } else if (!node.subNodes && node.steps) {
    content = node.steps.what;
  }

  return (<foreignObject
    x={node.x - (node.wrap / 2)}
    y={node.y - yOffset}
    width={node.wrap}
    height={node.height}
    key={`node-${node.id}`}
    style={{ overflow: 'visible' }}
  >
    <div
      style={{
        border: `${edgeStroke}px solid #e6e6e6`,
        backgroundColor: 'white',
        padding: '0.15rem',
        borderRadius: '6px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {node.typeIds.map(id =>
          (<TypePuck
            key={`${node.id}-puck-${id}`}
            typeObject={trcProjectTypes[id]}
            size={20}
          />)
        )}
      </div>
      <div
        style={{
          fontWeight: 400,
          textAlign: 'center',
          padding: '0 0 0.25rem',
        }}
      >
        {node.id}
      </div>
      <div style={{
        maxHeight: '100px',
        overflow: 'hidden',
      }}>
        {content}
      </div>
      {!node.decisionNode && <div style={{ textAlign: 'center' }}>
        <button
          style={{
            borderRadius: '6px',
            textDecoration: 'underline',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
          }}
          onClick={(e) => clickAction(e, node)}
        >
          ...more details
        </button>
      </div>}
    </div>
  </foreignObject>
)}


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
      modalNode: node ,
      modalY: e.target.getBoundingClientRect().y + window.scrollY,
    });
  }

  hideModal() {
    this.setState({ modalNode: null });
  }

  renderContent() {
    const { dimensions } = this.state;
    const height = dimensions.width < 768 ? 3000 : 5000;
    const nodePadding = 5;
    const edgeStroke = dimensions.width < 768 ? 3 : 4;
    const arrowWidth = edgeStroke * 1.5;
    const edgePadding = arrowWidth * 4;
    const nodeHeight = (height - (nodePadding * (this.numLevels + 4))) / this.numLevels;
    const puckSize = dimensions.width < 500 ? 20 : 25;
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
            {nodes.map(d => dimensions.width > 767 ? (
              <LargeNode
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
            )}
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
                width: '90vw'
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

export default AnnotatedDagre;
