import dagre from 'dagre';
import { trcProjectTypes } from './textContent';

// Return the whole trc type object, which includes label formatting, color, etc
export const getTRCTypeFromPermit = (permit) => {
  if (permit.permit_group === 'Planning') {
    return Object.values(trcProjectTypes).find(type =>
      type.permit_type === permit.permit_type &&
      type.permit_subtype === permit.permit_subtype);
  }
  return null;
};

export const getDagreGraph = (nodes, links, nodeSize) => {
  /*
  https://github.com/dagrejs/dagre
  */
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'TB',
    ranker: 'network-simplex',
    marginx: 0,
    marginy: 0,
  });

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
      link,
    );
  });

  dagre.layout(g);
  return g;
};

export function getNodes(dagreGraph, visWidth, nodeHeight, nodePadding) {
  /*
  The default dagre layout optimizes for being able to see links.  This function optimizes for evenly spacing the nodes across a screen (which is better on mobile).
  */
  // Copy nodes so as not to have weird side effects
  // What is the middle of the screen?
  const midpointX = visWidth / 2;

  // totalYOffsetValue has to be added to if there is a multi-row set of nodes
  let totalYOffsetValue = 0;

  const returnNodes = Object.values(dagreGraph._nodes).map((d) => {
    const returnNode = Object.assign({}, d);
    returnNode.coincidents = [].concat(Object.values(dagreGraph._nodes))
      .filter(val => val.y === d.y);

    returnNode.indexInCoincidents = returnNode.coincidents.findIndex(c => c.id === returnNode.id);
    // This logic allows for wrapping, but is unnecessary right now
    // returnNode.numPerRow = returnNode.coincidents.length <= 3 ?
    //   returnNode.coincidents.length : Math.ceil(returnNode.coincidents.length / 2);
    returnNode.numPerRow = returnNode.coincidents.length;

    // Basically, lower the nodes after design review if the larger nodes are being used
    returnNode.y += totalYOffsetValue;
    if (returnNode.numPerRow > 2
      && returnNode.indexInCoincidents === returnNode.coincidents.length - 1
      && visWidth > 767
    ) {
      totalYOffsetValue += 125;
    }

    // Wrap is just the width-- this is an artefact of using the React Annotations library for an earlier draft
    returnNode.wrap = (visWidth -
      (nodePadding + (nodePadding * returnNode.numPerRow))
    ) / returnNode.numPerRow;

    if (returnNode.maxWidth) {
      returnNode.wrap = Math.min(returnNode.wrap, returnNode.maxWidth);
    }

    const midRowIndex = (returnNode.numPerRow - 1) / 2;
    // Set x value
    returnNode.x = midpointX + (
      ((returnNode.indexInCoincidents % returnNode.numPerRow) - midRowIndex) *
      (nodePadding + returnNode.wrap)
    );

    return returnNode;

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

  return returnNodes;

  // Reiterate and update y values
  // return nodeValues;
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
    // Parallel edges are each links in their own right
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
    const rObj = Object.assign({}, link);
    const paddingAndStroke = edgePadding + edgeStroke;
    rObj.x1 = link.x1 + link.x1CoincidentIndex * paddingAndStroke - ((link.x1Coincidents.length - 1) * paddingAndStroke) / 2;
    rObj.x2 = link.x2 + link.x2CoincidentIndex * paddingAndStroke - ((link.x2Coincidents.length - 1) * paddingAndStroke) / 2;;
    return rObj;
  });
}
