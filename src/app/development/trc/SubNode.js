import React from 'react';
import NodeSteps from './NodeSteps';

function SubNode({ node, headingEl = 'h3' }) {
  const Heading = headingEl;
  return (
    <div
      key={node.id}
      className="py-2 px-1"
      style={{
        verticalAlign: 'top',
        flex: 1,
        minWidth: '150px',
      }}
    >
      <Heading className="text-xl">{node.id}</Heading>
      <NodeSteps steps={node.steps} nodeId={node.id} headingEl="h4" />
    </div>
  );
}

export default SubNode;
