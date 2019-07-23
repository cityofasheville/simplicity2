import React from 'react';
import dagre from 'dagre';
import { trcProjectTypes } from './textContent';

export const getTRCTypeFromPermit = (permit) => {
  if (permit.permit_group === 'Planning') {
    return Object.values(trcProjectTypes).find(type =>
      type.permit_type === permit.permit_type &&
      type.permit_subtype === permit.permit_subtype);
  }
  return null;
};

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
}

export function getNodes(dagreGraph, visWidth, nodeHeight, nodePadding) {
  // Copy nodes so as not to have weird side effects
  const nodeValues = [].concat(Object.values(dagreGraph._nodes));
  const midpointX = visWidth / 2;
  const annotationMargin = nodePadding;

  // let totalYOffsetValue = 0;
  // totalYOffsetValue has to be added to if there is a multi-row set of nodes
  nodeValues.forEach((d) => {
    d.coincidents = nodeValues.filter(val => val.y === d.y);

    d.indexInCoincidents = d.coincidents.findIndex(c => c.id === d.id);
    d.numPerRow = d.coincidents.length <= 3 ? d.coincidents.length : Math.ceil(d.coincidents.length / 2);

    d.wrap = (visWidth - (annotationMargin + annotationMargin * d.numPerRow)) / d.numPerRow;
    if (d.maxWidth) {
      d.wrap = Math.min(d.wrap, d.maxWidth)
    }

    // Set x value
    const midRowIndex = (d.numPerRow - 1) / 2;
    d.x = midpointX + ((d.indexInCoincidents % d.numPerRow) - midRowIndex) * (annotationMargin + d.wrap);

    // Y value must be set in separate iteration because it is used to determine coincidents
    // let thisYOffset = totalYOffsetValue;
    // Split into rows
    // if (d.coincidents.length > 2) {
    //   if (d.indexInCoincidents >= d.coincidents.length / 2) {
    //     thisYOffset += nodeHeight;
    //     if (d.indexInCoincidents % d.numPerRow === 0) {
    //       // If it's a new row
    //       totalYOffsetValue += nodeHeight;
    //     }
    //   }
    // }
    // d.yOffset = thisYOffset;
  });

  // Reiterate and update y values
  return nodeValues;

  // .map((d) => {
  //   const rVal = Object.assign({}, d);
  //   rVal.y = d.y + d.yOffset;
  //   return rVal;
  // });
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
