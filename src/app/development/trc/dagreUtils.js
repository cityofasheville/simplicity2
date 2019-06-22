import React from 'react';
import dagre from 'dagre';
import CityLogoSvg from '../../../shared/CityLogoSvg';
import Icon from '../../../shared/Icon';
import {
  DRAFTING_COMPASS,
  USER_FRIENDS,
} from '../../../shared/iconConstants';

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
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div>
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
  </div>
);

export const dagreNodes = [
  {
    id: 'Before the application is submitted',
    subNodes: [
      {
        id: 'Pre-application meeting',
        steps: {
          what: 'Developers and city staff meet to look at initial sketches, discuss process and schedule, and identify applicable regulations.',
          who: ['dev', 'staff'],
          when: 'Required before application submission',
          where: 'Development Services Department',
        },
      },
      {
        id: 'Neighborhood meeting',
        steps: {
          what: 'Developers must notify all property owners within 200 feet of the proposed development site.  Neighbors meet with developers to collaborate on neighborhood needs and opportunities.',
          who: ['dev', 'neighbors'],
          when: 'Ten days before application submission',
          where: 'Somewhere near the proposed development site, specified in the notice',
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
      who: ['dev'],
      when: 'After all required preliminary steps are completed.',
      where: 'Development Services Department',
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
      who: ['staff'],
      when: 'Within ten days of application submittal',
      where: 'Development Services Department',
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
      what: 'An eight-member body that ensures that the proposed project complies with standards and requirements.',
      who: ['dev', 'staff'],
      when: 'First and third Monday of each month',
      where: 'Development Services Department',
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
    steps: {
      what: <div>Projects located Downtown or in the River District must be reviewed for architectural design elements by a special design review sub-committee of either the <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTIIIDEKIADADBO_S7-3-8ASDOCO" target="_blank" rel="noopener noreferrer">Asheville Downtown Commission</a> or the <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTIIIDEKIADADBO_S7-3-10ASARRIRECO" target="_blank" rel="noopener noreferrer">Asheville Area Riverfront Redevelopment Commission</a> prior to approval.</div>,
      who: ['dev', 'staff', 'neighbors'],
      when: (<ul><li>Downtown Commission: second Friday of each month</li><li>Riverfront Commission: second Thursday of each month</li></ul>),
      where: (<ul><li>Downtown Commission: City Hall</li><li>Riverfront Commission: Explore Asheville offices</li></ul>),
    },
    typeIds: [
      'Level II',
    ],
  },
  {
    id: 'Planning and Zoning Commission',
    steps: {
      what: 'For  Conditional Zoning, Use and Level III projects, the Planning & Zoning Commission holds a public hearing and makes a recommendation for action to City Council.  For downtown Level II projects, the Planning & Zoning Commission verifies technical compliance with the requirements of applicable ordinances and documents and takes final action.',
      when: (<React.Fragment>Per <a href="#">published schedule</a></React.Fragment>),
// TODO: ADD LINK
      who: ['dev', 'staff', 'neighbors'],
// TODO: ADD ICON ETC FOR CITY OFFICIALS
      where: 'City Hall',
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
    steps: {
      what: 'Applications are reviewed during a public hearing before City Council.  These projects arrive at the City Council meeting with a recommendation for action that has been sent by the Planning and Zoning Commission.',
      who: ['dev', 'staff', 'neighbors'],
      when: 'The second and fourth Tuesday of each month',
      where: 'City Hall',
    },
// TODO: ADD ICON/WHO FOR CITY OFFICIALS
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

export const dagreLinks = [
  {
    source: 'Before the application is submitted',
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
  });
  // Reiterate and update y values
  return nodeValues.map((d) => {
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
    <li key={`${stepKey}-${nodeId}`} style={{ padding: '0.5rem 0' }}>
      <div
        style={{
          textTransform: 'capitalize',
          fontWeight: 400,
          width: '100%',
        }}
      >
        {stepKey}?
      </div>
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
      {stepKey !== 'who' && <div>{steps[stepKey]}</div>}
    </li>
  ))}
  </ul>
);
