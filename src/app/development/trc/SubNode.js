import React from 'react';
import NodeSteps from './NodeSteps';

const SubNode = ({ node }) => (
  <div
    key={node.id}
    style={{
      verticalAlign: 'top',
      padding: '0.5rem 0.25rem',
      flex: 1,
      minWidth: '150px',
    }}
  >
    <div style={{ fontSize: '1.25em', padding: '0 0 0.15em 0' }}>{node.id}</div>
    <NodeSteps steps={node.steps} nodeId={node.id} />
  </div>
);

export default SubNode;
