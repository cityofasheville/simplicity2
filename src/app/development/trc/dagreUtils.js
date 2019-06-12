import React from 'react';
import dagre from 'dagre';
import CityLogoSvg from '../../../shared/CityLogoSvg';
import Icon from '../../../shared/Icon';
import {
  DRAFTING_COMPASS,
  USER_FRIENDS,
} from '../../../shared/iconConstants';


export function getDagreGraph(nodes, links, nodeSize) {
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
};

export function getNodes(dagreGraph, visWidth, nodeHeight, nodePadding) {
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

export function getLinks(inputLinks, nodes, edgePadding, edgeStroke) {
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

export const displaySubNode = (node, lastNode = false) => (
  <div
    key={node.id}
    style={{ verticalAlign: 'top', padding: `0.5rem ${lastNode ? 0 : '1rem'} 0 0`, flex: 1 }}
  >
    <div style={{ fontSize: '1.25rem', padding: '0 0 1rem 0' }}>{node.id}</div>
    {nodeSteps(node.steps, node.id)}
  </div>
);

export const nodeSteps = (steps, nodeId) => (
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

export const whoIcons = {
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

export const decisionIconStyle = {
  margin: '0.25rem 1rem 0.25rem 0',
  width: '1.25em',
  color: 'white',
  textAlign: 'center',
  display: 'inline-block',
  borderRadius: '25%',
};

export const decisionIconHeader = (
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
