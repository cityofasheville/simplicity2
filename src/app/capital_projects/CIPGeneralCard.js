import React from 'react';
import PropTypes from 'prop-types';

const CIPGeneralCard = props => (
  <div style={{ backgroundColor: props.selected ? '#d3f1ff' : '#eeeeee', paddingBottom: '7px', paddingTop: '7px' }}>
    <div className="text-primary" style={{ minWidth: '240px' }}>
      {props.types.map((type, index) => (
        <div key={['CIPGeneral', index].join('_')} style={{ paddingLeft: '4px', paddingRight: '4px', paddingBottom: '4px' }}>
          <input type="checkbox" aria-label={type} label={type} value={type} checked={props.selection.includes(type)} readOnly />
          <span>{type}</span>
        </div>
      ))}
    </div>
  </div>
);

CIPGeneralCard.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string),
  selection: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.bool,
};

CIPGeneralCard.defaultProps = {
  types: ['Public', 'Affordable housing', 'Public safety', 'Transportation & infrastructure', 'General government', 'Parks & Recreations'],
  selection: ['Public', 'Affordable housing', 'Public safety', 'Transportation & infrastructure', 'General government', 'Parks & Recreations'],
  selected: true,
};

export default CIPGeneralCard;
