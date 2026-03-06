import React from 'react';
import TypePuck from './TypePuck';
import { decisionIconHeader, trcProjectTypes } from './textContent';

function SmallNode({ node, yOffset, edgeStroke, clickAction }) {
  let content;
  if (node.subNodes) {
    content = (
      <div>
        {node.subNodes.map((sub, subIndex) => (
          <div style={{ padding: subIndex > 0 ? '1rem 0 0' : 0 }} key={sub.id}>
            {sub.id}: {sub.steps.what}
          </div>
        ))}
      </div>
    );
  } else if (node.decisionNode) {
    content = <div>{decisionIconHeader}</div>;
  } else if (!node.subNodes && node.steps) {
    content = node.steps.what;
  }

  return (
    <foreignObject
      x={node.x - node.wrap / 2}
      y={node.y - yOffset}
      width={node.wrap}
      height={node.height}
      key={`node-${node.id}`}
      style={{ overflow: 'visible' }}
    >
      <div
        className=""
        style={{
          border: `${edgeStroke}px solid #e6e6e6`,
          backgroundColor: 'white',
          borderRadius: '6px',
        }}
      >
        <div class="px-2">
          <ul
            className="flex gap-1 flex-wrap mt-2 mb-1"
            aria-label={`Relevant permit types for step: ${node.id}`}
          >
            {node.typeIds.map((id) => (
              <li key={`${node.id}-puck-${id}`}>
                <TypePuck typeObject={trcProjectTypes[id]} size={30} textClass="text-sm" />
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-normal border-b mb-2">{node.id}</h2>
          <div
            className="pb-2"
            style={{
              maxHeight: '100px',
              overflow: 'hidden',
            }}
          >
            {content}
          </div>
        </div>

        {!node.decisionNode && (
          <div style={{ textAlign: 'center' }}>
            <button
              style={{
                textDecoration: 'underline',
                backgroundColor: '#f2f2f2',
                border: '1px solid transparent',
                width: '100%',
              }}
              onClick={(e) => clickAction(e, node)}
            >
              ...more details
            </button>
          </div>
        )}
      </div>
    </foreignObject>
  );
}

export default SmallNode;
