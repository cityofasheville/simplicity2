import React from 'react';
import PermitTypeCard from './PermitTypeCard'
import { trcProjectTypes } from '../utils';

const PermitTypeCards = () => {
  let cardWidth = '90%';
  // if (window.innerWidth < 760) {
  //   cardWidth = '40%';
  // }
  // if (window.innerWidth < 500) {
  //   cardWidth = '90%';
  // }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', flexWrap: 'wrap' }}>
    {Object.keys(trcProjectTypes).map(type => (
      <div
      style={{
        width: cardWidth,
        flexGrow: 1,
        margin: '0.25em',
        top: '0px',
      }}
      className={type}
      key={`card-${type}`}
      >
      <PermitTypeCard type={type} />
      </div>
    ))}
    </div>
  );
}


export default PermitTypeCards;
