import React from 'react';
import PropTypes from 'prop-types';
import CapitalProjectsSummaryCard from './CapitalProjectsSummaryCard';

const CIPFilter = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <p>Click or tap on the project categories below to filter the projects displayed in the table</p>.
      </div>
    </div>
    <div className="row">
      {props.types.map((type, index) => (
        <div className="col-lg-3 col-sm-6" key={['SummaryCard', type, 'index'].join('_')}>
          <CapitalProjectsSummaryCard type={type} selected={props.selected.includes(type)} />
        </div>
      ))}
    </div>
  </div>
);

CIPFilter.propTypes = {
  category: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.string),
  types: PropTypes.arrayOf(PropTypes.string),
};

CIPFilter.defaultProps = {
  category: 'Bonds',
  selected: ['Transportation', 'General CIP'],
  types: ['Transportation', 'Parks', 'Housing', 'General CIP'],
}

export default CIPFilter;
