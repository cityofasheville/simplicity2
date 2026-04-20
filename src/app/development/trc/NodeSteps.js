import React from 'react';
import { whoIcons } from './textContent';

function NodeSteps({ steps, nodeId, headingEl = 'h3' } = {}) {
  const Heading = headingEl;
  return (
    <ul style={{ listStyleType: 'none', padding: '0' }}>
      {Object.keys(steps).map((stepKey) => (
        <li key={`${stepKey}-${nodeId}`} style={{ padding: '0.25rem 0' }}>
          <Heading
            style={{
              textTransform: 'capitalize',
              fontWeight: 400,
              width: '100%',
            }}
          >
            {stepKey}?
          </Heading>
          {stepKey === 'who' && steps.who && (
            <div style={{ padding: '0 1rem' }}>
              {steps.who.map((actor) => (
                <div className="flex items-center justify-start gap-1" key={`${actor}-${nodeId}`}>
                  {whoIcons[actor].icon}
                  <span>{whoIcons[actor].label}</span>
                </div>
              ))}
            </div>
          )}
          {stepKey !== 'who' && <div style={{ padding: '0 1rem' }}>{steps[stepKey]}</div>}
        </li>
      ))}
    </ul>
  );
}

export default NodeSteps;
