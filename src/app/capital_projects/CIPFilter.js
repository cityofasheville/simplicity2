import React from 'react';
import PropTypes from 'prop-types';
import CapitalProjectsSummaryCard from './CapitalProjectsSummaryCard';

const CIPFilter = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <p style={{ marginTop: '10px' }}>Click or tap on the project categories below to select/deselect the projects displayed to view</p>.
      </div>
    </div>
    <div className="row">
      {props.categories.map((category, index) => (
        <div className="col-sm-3 col-xs-6" key={['SummaryCard', category, 'index'].join('_')}>
          <CapitalProjectsSummaryCard category={category} selected={props.selected.includes(category)} />
        </div>
      ))}
    </div>
  </div>
);

CIPFilter.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
};

CIPFilter.defaultProps = {
  selected: ['Bond - Transportation Program'],
  categories: ['Bond - Transportation Program', 'Bond - Parks Program', 'Bond - Housing Program', 'General CIP'],
}

export default CIPFilter;
