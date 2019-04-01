import React from 'react';
import PermitTypeCard from './PermitTypeCard'
import { trcProjectTypes } from '../utils';

const PermitTypeCards = () => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', flexWrap: 'wrap' }}>
    {Object.keys(trcProjectTypes).map(type => <PermitTypeCard type={type} key={`card-${type}`} />)}
  </div>
)

export default PermitTypeCards;
