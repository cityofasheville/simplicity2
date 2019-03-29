import React from 'react';

const TypePuck = ({ color, text }) => (
  <svg height={50} width={50}>
    <circle
      r={25}
      cx={25}
      cy={25}
      style={{ fill: color, stroke: 'white', strokeWidth: '2px' }}
    />
    <text
      x="25"
      y="25"
      style={{
        stroke: 'white',
        strokeWidth: 2,
        textAnchor: 'middle',
        alignmentBaseline: 'middle',
        letterSpacing: '0.15em'
      }}>
        {text}
      </text>
  </svg>
)

export default TypePuck;
