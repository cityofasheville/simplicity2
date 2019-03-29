import React from 'react';

const TypePuck = ({ color, text, size = 50 }) => (
  <svg height={size} width={size}>
    <circle
      r={size / 2}
      cx={size / 2}
      cy={size / 2}
      style={{ fill: color, stroke: 'white', strokeWidth: '2px' }}
    />
    <text
      x={size / 2}
      y={size / 2}
      style={{
        stroke: 'white',
        strokeWidth: 1,
        textAnchor: 'middle',
        alignmentBaseline: 'middle',
        letterSpacing: '0.15em',
        fontSize: 16 * (size / 50),
      }}>
        {text}
      </text>
  </svg>
)

export default TypePuck;
