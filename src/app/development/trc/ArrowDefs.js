import React from 'react';
import { trcProjectTypes } from './textContent';

const ArrowDefs = ({ arrowWidth }) => (
  <defs>
    {Object.values(trcProjectTypes).map(type => (
      <marker
        key={`marker-${type.short}`}
        id={`marker-${type.short}`}
        markerWidth={arrowWidth}
        markerHeight={arrowWidth}
        refX={arrowWidth * (2 / 3)}
        refY={arrowWidth / 2}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d={`M0,0 L0,${arrowWidth} L${arrowWidth * (2 / 3)},${arrowWidth / 2} z`}
          fill={type.color}
        />
      </marker>
    ))}
  </defs>
);

export default ArrowDefs;
