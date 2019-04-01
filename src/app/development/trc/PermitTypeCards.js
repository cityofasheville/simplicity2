import React from 'react';
import PermitTypeCard from './PermitTypeCard'
import { trcProjectTypes } from '../utils';

const PermitTypeCards = () => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', flexWrap: 'wrap' }}>
    {Object.keys(trcProjectTypes).map(type => (
      <div
        style={{
          width: window.innerWidth > 760 ? '25%': '40%',
          flexGrow: 1,
          margin: '1em',
          top: '0px',
        }}
        className={type}
        key={`card-${type}`}
      >
        <PermitTypeCard type={type} />
      </div>
    ))}
  </div>
)

export default PermitTypeCards;
