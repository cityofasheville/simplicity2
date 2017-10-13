import React from 'react';
import PropTypes from 'prop-types';

const FilterCheckboxGroup = props => (
  <div className="row">

      { props.children }

  </div>
);

FilterCheckboxGroup.propTypes = {
  children: PropTypes.node,
};

FilterCheckboxGroup.defaultProps = {
  children: null,
};

export default FilterCheckboxGroup;

