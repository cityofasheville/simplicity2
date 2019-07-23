import React from 'react';

const SmallNode = ({ node, yOffset, edgeStroke, clickAction }) => {
  let content;
  if (node.subNodes) {
    content = (
      <div>
        {node.subNodes.map((sub, subIndex) => (
          <div
            style={{ padding: subIndex > 0 ? '1rem 0 0' : 0 }}
            key={sub.id}
          >
            {sub.id}: {sub.steps.what}
          </div>))
        }
      </div>
    );
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
      {!node.decisionNode && (
        <div style={{ textAlign: 'center' }}>
          <button
            style={{
              textDecoration: 'underline',
              backgroundColor: '#f2f2f2',
              border: '1px solid transparent',
              width: '100%',
            }}
            onClick={e => clickAction(e, node)}
          >
            ...more details
          </button>
        </div>
      )}
    </div>
  </foreignObject>
)}

export default SmallNode;
