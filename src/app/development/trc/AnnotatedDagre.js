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

function getDagreGraph(nodes, links, nodeSize = 8) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', ranker: 'network-simplex' });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(
      node.id,
      {
        label: node.id,
        width: node.width || nodeSize,
        height: node.height || nodeSize,
        description: node.description,
        color: node.color ? node.color : 'gray',
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

function getAnnotations(dagreGraph) {
  const nodeValues = Object.values(dagreGraph._nodes);
  nodeValues.forEach((d) => {
    d.coincidents = nodeValues.filter(val => val.y === d.y);
    d.indexInCoincidents = d.coincidents.findIndex(c => c.label === d.label);
  })
  return nodeValues.map((d) => {
    const rVal = {
      id: d.label,
      coincidents: d.coincidents,
      indexInCoincidents: d.indexInCoincidents,
      description: d.description,
      color: 'black',
      connector: { end: 'none' },
      disable: 'subject',
      type: 'node',
    };
    return rVal;
  });
}


class AnnotatedDagre extends React.Component {
  constructor(props) {
    super(props);
    this.projectTypes = props.projectTypes;
    this.nodeSize = 8;
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
          { color: this.projectTypes['Major Subdivision'].color, weight: 3 },
          { color: this.projectTypes['Level II'].color, weight: 3 },
          { color: this.projectTypes['Level III'].color, weight: 3 },
          { color: this.projectTypes['Conditional Zoning'].color, weight: 3 },
          { color: this.projectTypes['Conditional Use Permit'].color, weight: 3 },
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
          { color: 'gray', weight: 3 },
          { color: this.projectTypes['Level II'].color, weight: 3 },
        ]
      },
      {
        source: 'Design Review',
        target: 'Planning and Zoning Commission',
        parallelEdges: [
          { color: 'gray', weight: 3 },
          { color: this.projectTypes['Level II'].color, weight: 3 },
        ]
      },
      {
        source: 'Technical Review Committee',
        target: 'Planning and Zoning Commission',
        parallelEdges: [
          { color: this.projectTypes['Level III'].color, weight: 3 },
          { color: this.projectTypes['Conditional Zoning'].color, weight: 3 },
          { color: this.projectTypes['Conditional Use Permit'].color, weight: 3 },
        ]
      },
      {
        source: 'Planning and Zoning Commission',
        target: 'Level II and Downtown Major Subdivision Decision',
        parallelEdges: [
          { color: 'gray', weight: 3 },
          { color: this.projectTypes['Level II'].color, weight: 3 },
        ]
      },
      {
        source: 'Planning and Zoning Commission',
        target: 'City Council',
        parallelEdges: [
          { color: this.projectTypes['Level III'].color, weight: 3 },
          { color: this.projectTypes['Conditional Zoning'].color, weight: 3 },
          { color: this.projectTypes['Conditional Use Permit'].color, weight: 3 },
        ]
      },
      {
        source: 'City Council',
        target: 'City Council Decision',
        parallelEdges: [
          { color: this.projectTypes['Level III'].color, weight: 3 },
          { color: this.projectTypes['Conditional Zoning'].color, weight: 3 },
          { color: this.projectTypes['Conditional Use Permit'].color, weight: 3 },
        ]
      },
    ]
    this.graph = getDagreGraph(this.nodes, this.links, this.nodeSize);
    this.annotations = getAnnotations(this.graph);
  }

  render() {
    const screenWidth = document.documentElement.clientWidth;
    const sideMargin = screenWidth / 12;
    const height = screenWidth < 768 ? 4000 : 3000;
    const verticalMargin = Math.max(80, 80 * (700 / screenWidth));
    const fontSize = screenWidth < 750 ? 12 : 14;

    return (<div
      style={{
        width: '100%',
        height,
        display: 'inline-block',
        fontSize
      }}
     >
      <ResponsiveNetworkFrame
        size={[320, 1000]}
        margin={{
          top: verticalMargin,
          right: sideMargin,
          bottom: 0,
          left: sideMargin
        }}
        responsiveWidth
        responsiveHeight
        graph={this.graph}
        annotations={this.annotations}
        svgAnnotationRules={(d) => {
          // Side padding and padding between
          const notePadding = fontSize / 2;
          const annotationMargin = fontSize + notePadding;
          const numPerRow = d.d.coincidents.length < 3 ? d.d.coincidents.length : Math.ceil(d.d.coincidents.length / 2);
          // Max number of rows is two
          const midRowIndex = (numPerRow - 1) / 2;
          const defaultOffsetY = fontSize * 3;
          const wrap = Math.min(
            (screenWidth - sideMargin * 2 - (annotationMargin + annotationMargin * numPerRow)) / numPerRow,
            400
          )
          const midpointX = d.networkFrameState.adjustedSize[0] / 2;

          let thisYOffset = -defaultOffsetY;
          let thisXOffset = 0;
          let curveBeta = 0.25;

          // Split into rows
          if (d.d.coincidents.length > 2) {
            curveBeta = 0.5
            if (d.d.indexInCoincidents >= d.d.coincidents.length / 2) {
              thisYOffset = defaultOffsetY * 2;
            }
          }

          const xPosition = midpointX + ((d.d.indexInCoincidents % numPerRow) - midRowIndex) * (annotationMargin + wrap);
          thisXOffset = xPosition - d.d.x;

          // const customAnnotation = (<foreignObject width={wrap} x={thisXOffset - wrap / 2} y={thisYOffset}>
          //   <p>When someone wants to build or modify a building on private property in the City of Asheville, they must comply with federal, state, county, and city standards. Which standards apply depends on how large the building is or how much the building will be modified.</p>
          // </foreignObject>)

          return (<Annotation
            x={d.d.x}
            y={d.d.y}
            dy={thisYOffset}
            dx={thisXOffset}
            color="gray"
            title={d.d.label}
            label={d.d.description}
            className="show-bg"
            disable="subject"
            key={`${d.d.label}-annotation`}
          >
            <ConnectorCurve
              curve={curveBundle.beta(curveBeta)}
            />
            <Note
              align={'middle'}
              orientation={"topBottom"}
              bgPadding={notePadding}
              padding={notePadding}
              titleColor={"gray"}
              lineType={null}
              wrap={wrap}
            />
          </Annotation>)
        }}
        networkType={{
          type: 'dagre',
          zoom: 'true',
        }}
        edgeStyle={d => ({ stroke: 'white', fill: d.color, strokeWidth: 1 })}
        customNodeIcon={(d) => {
          return (<circle
            cx={d.d.x}
            cy={d.d.y}
            r={fontSize}
            style={{ fill: '#d9d9d9', stroke: 'gray' }}
          />)
        }}
      />
    </div>)
  }

}

export default AnnotatedDagre;
