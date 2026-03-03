import React from 'react';
import PermitTypeCard from './PermitTypeCard';
import { trcProjectTypes } from './textContent';

function PermitTypeCards() {
  let cardWidth = '40%';
  if (window.innerWidth < 500) {
    cardWidth = '90%';
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.keys(trcProjectTypes).map((type) => {
        return <PermitTypeCard type={type} />;
      })}
    </div>
  );
}

export default PermitTypeCards;
