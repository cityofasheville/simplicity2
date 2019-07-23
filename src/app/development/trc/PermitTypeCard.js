import React from 'react';
import TypePuck from './TypePuck';
import { trcProjectTypes, descriptorTitles } from './textContent';

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
          size={40}
        />
        <span style={{ fontSize: '2rem', verticalAlign: 'top', padding: '0 0 0 1rem' }}>
          {type}
        </span>
      </div>
      <div>
        {Object.keys(projectType.descriptors).map(key => (
          <div key={`descriptors-${type}-${key}`} style={{ padding: '0 0 0.5rem' }}>
            <div style={{ fontWeight: '400' }}>
              {descriptorTitles[key]}
            </div>
            {projectType.descriptors[key]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermitTypeCard;
