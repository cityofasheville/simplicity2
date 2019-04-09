import React from 'react';
import TypePuck from './TypePuck';
import { trcProjectTypes } from '../utils';

const PermitTypeCard = ({ type }) => {
  const projectType = trcProjectTypes[type];
  return (
    <div
      style={{
        border: `5px solid ${projectType.color}`,
        backgroundColor: 'white',
        padding: '1em',
        borderRadius: '6px',
        height: '100%',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <TypePuck
          typeObject={projectType}
          hover={false}
        />
      </div>
      <div
        style={{
          width: '100%',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '0.5em 0'
        }}
      >
        {type}
      </div>
      <div>{projectType.description}</div>
    </div>
  )
}

export default PermitTypeCard;
