import React from 'react';
import { whoIcons } from './textContent';

const NodeSteps = (steps, nodeId) => (
  <ul style={{ listStyleType: 'none', padding: '0' }}>{Object.keys(steps).map(stepKey => (
    <li key={`${stepKey}-${nodeId}`} style={{ padding: '0.25rem 0' }}>
      <div
        style={{
          textTransform: 'capitalize',
          fontWeight: 400,
          width: '100%',
        }}
      >
        {stepKey}?
      </div>
      {stepKey === 'who' && steps.who &&
        <div style={{ padding: '0 1rem' }}>
          {steps.who.map(actor => (
            <div key={`${actor}-${nodeId}`}>
              <div
                style={{ padding: '0 0.5rem 0 0', width: '2rem', display: 'inline-block' }}
              >
                {whoIcons[actor].icon}
              </div>
              <span>{whoIcons[actor].label}</span>
            </div>
          ))}
        </div>
      }
      {stepKey !== 'who' && <div style={{ padding: '0 1rem' }}>{steps[stepKey]}</div>}
    </li>
  ))}
  </ul>
);

export default NodeSteps;
