import React from 'react';
import LargeNodeContents from './LargeNodeContents';

const LargeNodeWrapper = ({ node, yOffset, edgeStroke }) => (
  <foreignObject
    x={node.x - (node.wrap / 2)}
    y={node.y - yOffset}
    width={node.wrap}
    height={node.height}
    key={`node-${node.id}`}
    style={{ overflow: 'visible' }}
  >
    <LargeNodeContents node={node} yOffset={yOffset} edgeStroke={edgeStroke} />
  </foreignObject>
);

export default LargeNodeWrapper;
