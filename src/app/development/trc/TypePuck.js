import React from 'react';
import PermitTypeCard from './PermitTypeCard';

const TypePuck = ({ typeObject, size = 50 }) => {
  return (
    <div style={{ display: 'inline-block' }}>
      {/*<PermitTypeCard hidden type={typeObject.id} />*/}
      <svg
        height={size}
        width={size}
        onMouseEnter={e => console.log(e)}
        onMouseLeave={e => console.log(e)}
      >
        <circle
          r={size / 2}
          cx={size / 2}
          cy={size / 2}
          style={{ fill: typeObject.color, stroke: 'white', strokeWidth: '2px' }}
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
          }}
        >
          {typeObject.short}
        </text>
      </svg>
    </div>
  )
}

export default TypePuck;
