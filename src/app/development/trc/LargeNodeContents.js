import React from 'react';
import PropTypes from 'prop-types';
import SubNode from './SubNode';
import NodeSteps from './NodeSteps';
import TypePuck from './TypePuck';
import { decisionIconHeader, trcProjectTypes, dagreNodes, dagreLinks } from './textContent';

/*
Used to create contents of nodes on screens above tablet breakpoint (see FlowDiagram). 
Also used to render modal after a users clicks "more details" link on a node on a smaller screen.

See ./textContent for the nodes themselves.
*/
function LargeNodeContents({ node, edgeStroke, modalCloseFunc = null, modalOpen = false }) {
  let content;
  let nodeLinks = dagreLinks.filter((link) => link.source === node.id);
  let nodeTypeTargets = nodeLinks.reduce((acc, link) => {
    if (link?.parallelEdges) {
      acc[link.target] = link.parallelEdges.reduce((typeAcc, parallelLink) => {
        if (parallelLink.id) {
          typeAcc.push(parallelLink.id);
        }
        return typeAcc;
      }, []);
    } else {
      acc[link.target] = [];
    }
    return acc;
  }, {});

  const nextStepsMarkup = nodeLinks.length > 0 && (
    <>
      <h3 className="px-1 font-normal">Next Steps</h3>
      <ul className="list-disc list-inside ml-4 mb-4">
        {Object.keys(nodeTypeTargets).map((targetId) => {
          let thisHtmlId = dagreNodes.find((n) => n.id === targetId)?.htmlId;
          return (
            <li className="my-1" key={`${node.id}-link-${thisHtmlId}`}>
              <span aria-details={thisHtmlId}>{targetId}</span>
              {nodeTypeTargets[targetId] && nodeTypeTargets[targetId].length > 0 && (
                <ul
                  className="flex gap-1 flex-wrap ml-4"
                  aria-label={`Relevant permit types for the next step: ${targetId}`}
                >
                  {nodeTypeTargets[targetId].map((typeId) => (
                    <li key={`${node.id}-link-${thisHtmlId}-type-${typeId}`}>
                      <TypePuck
                        typeObject={trcProjectTypes[typeId]}
                        size={25}
                        textClass="text-xs"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );

  if (node.subNodes) {
    content = (
      <>
        {' '}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {node.subNodes.map((sub, subIndex, subNodeArray) => (
            <SubNode node={sub} lastNode={subIndex === subNodeArray.length - 1} key={sub.id} />
          ))}
        </div>
        {!node.decisionNode && <>{nextStepsMarkup}</>}
      </>
    );
  } else if (node.decisionNode) {
    content = <div>{decisionIconHeader}</div>;
  } else if (!node.subNodes && node.steps) {
    content = !node.decisionNode && (
      <>
        <NodeSteps steps={node.steps} nodeId={node.id} headingElement="h3" />
        {nextStepsMarkup}
      </>
    );
  }

  return (
    <div
      id={`${node.htmlId}`}
      style={{
        border: `${edgeStroke}px solid #e6e6e6`,
        backgroundColor: 'white',
        padding: '0.5rem 0.5rem',
        borderRadius: '6px',
      }}
    >
      <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b">
        <h2
          style={{
            fontWeight: 400,
            textAlign: 'left',
            fontSize: '1.15rem',
          }}
        >
          {node.id}
        </h2>
        <ul
          className="flex gap-1 flex-wrap"
          aria-label={`Relevant permit types for step: ${node.id}`}
        >
          {node.typeIds.map((id) => (
            <li key={`${node.id}-puck-${id}`}>
              <TypePuck typeObject={trcProjectTypes[id]} size={35} textClass="text-sm" />
            </li>
          ))}
        </ul>
      </div>
      {content}
    </div>
  );
}

LargeNodeContents.propTypes = {
  node: PropTypes.shape({}).isRequired,
  edgeStroke: PropTypes.number,
  modalCloseFunc: PropTypes.func,
};

LargeNodeContents.defaultProps = {
  modalCloseFunc: null,
  edgeStroke: 3,
};

export default LargeNodeContents;
