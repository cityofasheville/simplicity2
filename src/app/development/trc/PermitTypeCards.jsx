import React from 'react';
import PermitTypeCard from './PermitTypeCard';
import { trcProjectTypes } from './textContent';

function PermitTypeCards() {
  let cardWidth = '40%';
  if (window.innerWidth < 500) {
    cardWidth = '90%';
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">
      {Object.keys(trcProjectTypes).map((type) => {
        return <PermitTypeCard type={type} key={type} />;
      })}
    </div>
  );
}

export default PermitTypeCards;
