import React from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre';
import { curveBundle } from 'd3-shape';
import { ResponsiveNetworkFrame } from 'semiotic';
import { Annotation, ConnectorCurve, Note } from 'react-annotation';

function calculateEdges(link) {
  const weight = 2;
  if (link.parallelEdges) {
    return link.parallelEdges.map((e) => {
      const thisEdge = Object.assign({}, e);
      thisEdge.weight = weight;
      return thisEdge;
    });
  }
  return [{ color: link.color ? link.color : 'gray', weight }];
}

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
      }
    );
  });

  links.forEach((link) => {
    g.setEdge(
      link.source,
      link.target,
      {
        parallelEdges: calculateEdges(link),
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
      400
    )

    // Set x value
    const midRowIndex = (d.numPerRow - 1) / 2;
    d.x = midpointX + ((d.indexInCoincidents % d.numPerRow) - midRowIndex) * (annotationMargin + d.wrap);

    // Y value must be set in separate iteration because it is used to determine coincidents
    let thisYOffset = totalYOffsetValue;
    // Split into rows
    if (d.coincidents.length > 2) {
      if (d.indexInCoincidents >= d.coincidents.length / 2) {
        thisYOffset = nodeHeight / 2;
        if (d.indexInCoincidents % d.numPerRow === 0) {
          // If it's a new row
          totalYOffsetValue += nodeHeight / 2;
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
      newLinkVal.color = parallel.color;
      withoutParallels.push(newLinkVal);
    })
  })

  // Then iterate and reassign x values to all using parallelEdges algorithm
  withoutParallels.forEach(link => {
    // TODO: also consider it a coincident if its nodes are coincident with one another
    link.x1Coincidents = withoutParallels.filter(otherLink => otherLink.x1 === link.x1 && otherLink.y1 === link.y1);
    link.x1CoincidentIndex = link.x1Coincidents.findIndex(coincident =>
      coincident.source === link.source && coincident.target === link.target && coincident.color === link.color);

    // total number of links entering and leaving node is how spread out they need to be
    link.x2Coincidents = withoutParallels.filter(otherLink => otherLink.x2 === link.x2 && otherLink.y2 === link.y2);
    link.x2CoincidentIndex = link.x2Coincidents.findIndex(coincident =>
      coincident.source === link.source && coincident.target === link.target && coincident.color === link.color);
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
  constructor(props) {
    super(props);
    this.projectTypes = props.projectTypes;
    this.nodes = [
      {
        id: 'Pre-Application and Neighborhood Meeting',
        description: 'The developer must arrange a neighborhood meeting and invite property owners within 200 feet of the proposed development. The meeting must be no more than four months but at least ten days before application submission. At least ten days prior to the meeting, property must be posted and notice of the meeting mailed.  The developer must also meet with city staff at a pre-application meeting.'
      },
      {
        id: 'Level I',
        description: 'Projects smaller than 35,000 square feet or with fewer than 20 residential units that trigger zoning compliance requirements.',
      },
      {
        id: 'Major Subdivision',
        description: 'Any project that requires the extension or creation of a new public or private street.  Typically these projects create new residential lots.',
      },
      {
        id: 'Level II',
        description: 'Commercial projects between 35,000 and 99,999 square feet, residential projects between 20 and 49 units, and industrial projects with a floor larger than 100,000 square feet.  Different restrictions apply in the River District or certain expansion projects.',
      },
      {
        id: 'Level III',
        description: 'Commercial projects over 100,000 square feet, residential projects over 50 units, industrial projects in the River District that are over 100,000 square feet, and certain expansion projects.',
      },
      {
        id: 'Conditional Zoning',
        description: 'Any development project seeking to change the zoning of a site and develop it at the same time.',
      },
      {
        id: 'Conditional Use Permit',
        description: 'Anything that is listed as a conditional use in section 7-16-2 of the Unified Development Ordinance.',
        // TODO: ADD LINK
      },
      {
        id: 'Staff Review',
        description: 'Staff from various technical disciplines review plans for compliance with applicable ordinances and documents and create a staff report.',
        // TODO: ADD WHERE THEY CAN FIND THE STAFF REPORT
      },
      {
        id: 'Level I Decision',
        description: 'When plans for a Level I scale project show that all technical requirements are met, staff approves the plans and issues a permit.',
      },
      {
        id: 'Technical Review Committee',
        description: 'An eight-member body that ensures that the proposed project complies with standards and requirements. Consists of six staff, a representative of the Tree Commission, and a member representing the Buncombe County Metropolitan Sewer District (MSD).',
      },
      {
        id: 'Major Subdivision Decision',
        description: 'When plans for a Major Subdivision or non-downtown Level II scale project show that all technical requirements are met, staff approves the plans and issues a permit.  For major subdivisions and Level II projects that are not in a special zoning area like downtown, the Technical Review Committee is the body that either accepts or rejects the proposal.'
      },
      {
        id: 'Design Review',
        description: 'All downtown level II, downtown subdivisions, and special zoning district Level III go to desgin review. The decision made in this step is a a non-binding recommendation.'
      },
      {
        id: 'Planning and Zoning Commission',
        description: 'The Commission consists of 7 members, 5 City residents appointed by City Council and 2 residents of the extra-territorial area of the City and appointed by Buncombe County Commissioners.  The commission approves downtown Level II projects and holds public hearings for conditional zoning and conditional use permits and makes a recommendation for action to city council.',
      },
      {
        id: 'Level II and Downtown Major Subdivision Decision',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        id: 'City Council',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        id: 'City Council Decision',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ]
    this.links = [
      {
        source: 'Pre-Application and Neighborhood Meeting',
        target: 'Major Subdivision',
        color: this.projectTypes['Major Subdivision'].color,
      },
      {
        source: 'Pre-Application and Neighborhood Meeting',
        target: 'Level II',
        color: this.projectTypes['Level II'].color,
      },
      {
        source: 'Pre-Application and Neighborhood Meeting',
        target: 'Level III',
        color: this.projectTypes['Level III'].color,
      },
      {
        source: 'Pre-Application and Neighborhood Meeting',
        target: 'Conditional Zoning',
        color: this.projectTypes['Conditional Zoning'].color,
      },
      {
        source: 'Pre-Application and Neighborhood Meeting',
        target: 'Conditional Use Permit',
        color: this.projectTypes['Conditional Use Permit'].color,
      },
      {
        source: 'Level I',
        target: 'Staff Review',
        color: this.projectTypes['Level I'].color,
      },
      {
        source: 'Major Subdivision',
        target: 'Staff Review',
        color: this.projectTypes['Major Subdivision'].color,
      },
      {
        source: 'Level II',
        target: 'Staff Review',
        color: this.projectTypes['Level II'].color,
      },
      {
        source: 'Level III',
        target: 'Staff Review',
        color: this.projectTypes['Level III'].color,
      },
      {
        source: 'Conditional Zoning',
        target: 'Staff Review',
        color: this.projectTypes['Conditional Zoning'].color,
      },
      {
        source: 'Conditional Use Permit',
        target: 'Staff Review',
        color: this.projectTypes['Conditional Use Permit'].color,
      },
      {
        source: 'Staff Review',
        target: 'Level I Decision',
        color: this.projectTypes['Level I'].color,
      },
      {
        source: 'Staff Review',
        target: 'Technical Review Committee',
        parallelEdges: [
          { color: this.projectTypes['Major Subdivision'].color },
          { color: this.projectTypes['Level II'].color },
          { color: this.projectTypes['Level III'].color },
          { color: this.projectTypes['Conditional Zoning'].color },
          { color: this.projectTypes['Conditional Use Permit'].color },
        ]
      },
      {
        source: 'Technical Review Committee',
        target: 'Major Subdivision Decision',
        color: this.projectTypes['Major Subdivision'].color,
      },
      {
        source: 'Technical Review Committee',
        target: 'Design Review',
        // All level II, downtown subdivisions, and special district L3 etc go to desgin review?
        parallelEdges: [
          { color: 'gray' },
          { color: this.projectTypes['Level II'].color },
        ]
      },
      {
        source: 'Design Review',
        target: 'Planning and Zoning Commission',
        parallelEdges: [
          { color: 'gray' },
          { color: this.projectTypes['Level II'].color },
        ]
      },
      {
        source: 'Technical Review Committee',
        target: 'Planning and Zoning Commission',
        parallelEdges: [
          { color: this.projectTypes['Level III'].color },
          { color: this.projectTypes['Conditional Zoning'].color },
          { color: this.projectTypes['Conditional Use Permit'].color },
        ]
      },
      {
        source: 'Planning and Zoning Commission',
        target: 'Level II and Downtown Major Subdivision Decision',
        parallelEdges: [
          { color: 'gray' },
          { color: this.projectTypes['Level II'].color },
        ]
      },
      {
        source: 'Planning and Zoning Commission',
        target: 'City Council',
        parallelEdges: [
          { color: this.projectTypes['Level III'].color },
          { color: this.projectTypes['Conditional Zoning'].color },
          { color: this.projectTypes['Conditional Use Permit'].color },
        ]
      },
      {
        source: 'City Council',
        target: 'City Council Decision',
        parallelEdges: [
          { color: this.projectTypes['Level III'].color },
          { color: this.projectTypes['Conditional Zoning'].color },
          { color: this.projectTypes['Conditional Use Permit'].color },
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
    const height = visWidth < 768 ? 5000 : 3500;
    const nodePadding = 10;
    const edgePadding = 15;
    const edgeStroke = 10;
    const nodeHeight = (height - nodePadding * (this.numLevels + 1)) / (this.numLevels + 1);

    const graph = getDagreGraph(this.nodes, this.links, nodeHeight, nodePadding);
    const nodes = getNodes(graph, visWidth, nodeHeight, nodePadding);
    const links = getLinks(this.links, nodes, edgePadding, edgeStroke);

    console.log(links)

    // If any node in the past had a high enough coincidents number that it had to be moved, add to y value for remaining
    return (<svg height={height} width={visWidth}>
      {links.map((d, i) =>
        // d.parallelEdges ?
        // d.parallelEdges.map((edge, i, ogArray) => {
        //   const edgeOffset = edgePadding + edgeStroke;
        //   const xOffset = edgeOffset * i;
        //
        //   // If we're moving to the right, then the y values need to be shorter
        //   let edgeOffsetSign = -1;
        //   if (d.x2 < d.x1) {
        //     // If we're moving to the left, then y values need to be longer
        //     edgeOffsetSign = 1;
        //   }
        //
        //   const thisYOffset = edgeOffset * edgeOffsetSign * i;
        //
        //   const thirdYDiff = (d.y2 - d.y1) / 3;
        //   return (
        //     <path
        //       d={`M${d.x1 + xOffset} ${d.y1}
        //         L${d.x1 + xOffset} ${d.y1 + thirdYDiff + thisYOffset}
        //         L${d.x2 + xOffset} ${d.y1 + (thirdYDiff * 2) + thisYOffset}
        //         L${d.x2 + xOffset} ${d.y2}`}
        //       style={{
        //         stroke: edge.color || 'gray',
        //         strokeWidth: edgeStroke,
        //         fill: 'none',
        //       }}
        //       key={`${d.source}-${d.target}-${i}`}
        //     />)
        //   }) :
        (<path
          d={`M${d.x1} ${d.y1}
            L${d.x1} ${d.y1 + ((d.y2 - d.y1) / 3)}
            L${d.x2} ${d.y1 + ((d.y2 - d.y1) / 3) * 2}
            L${d.x2} ${d.y2}`}
          style={{
            stroke: d.color || 'gray',
            strokeWidth: edgeStroke,
            fill: 'none',
          }}
          key={`${d.source}-${d.target}-${i}`}
        />)
      )}
      {nodes.map(d => (
        <Annotation
          x={d.x - d.wrap / 2}
          y={d.y}
          dy={0}
          dx={0}
          color="gray"
          title={d.id}
          label={d.description}
          className="show-bg"
          key={`${d.id}-annotation`}
        >
          <Note
            align="middle"
            orientation="leftRight"
            bgPadding={nodePadding}
            padding={nodePadding}
            titleColor="gray"
            lineType={null}
            wrap={d.wrap}
          />
        </Annotation>
      ))}
    </svg>);
  }

}

export default AnnotatedDagre;
