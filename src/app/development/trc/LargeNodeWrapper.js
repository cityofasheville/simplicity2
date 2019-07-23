import React from 'react';
import PropTypes from 'prop-types';
import LargeNodeContents from './LargeNodeContents';

/*
Because LargeNodeContents is used both in the diagram and as a modal, the wrapper which positions it in the SVG had to be separated out.

https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject
*/
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

LargeNodeWrapper.propTypes = {
  node: PropTypes.shape({}).isRequired,
  yOffset: PropTypes.number.isRequired,
  edgeStroke: PropTypes.number,
};

LargeNodeWrapper.defaultProps = {
  edgeStroke: 3,
};

export default LargeNodeWrapper;
