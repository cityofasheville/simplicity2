import React from 'react';
import SubNode from './SubNode';
import NodeSteps from './NodeSteps';
import TypePuck from './TypePuck';
import { decisionIconHeader, trcProjectTypes } from './textContent';

const LargeNodeContents = ({ node, yOffset, edgeStroke, modalCloseFunc = null }) => {
  let content;
  if (node.subNodes) {
    content = (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {node.subNodes.map((sub, subIndex, subNodeArray) =>
          <SubNode node={sub} lastNode={subIndex === subNodeArray.length - 1} />
        )}
      </div>
    );
  } else if (node.decisionNode) {
    content = <div>{decisionIconHeader}</div>;
  } else if (!node.subNodes && node.steps) {
    content = <NodeSteps steps={node.steps} nodeId={node.id} />;
  }

  return (
    <div
      style={{
        border: `${edgeStroke}px solid #e6e6e6`,
        backgroundColor: 'white',
        padding: '0.5rem 0.5rem',
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
            />))
          }
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
  );
};

export default LargeNodeContents;
