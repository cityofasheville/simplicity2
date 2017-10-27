import React from 'react';
import PropTypes from 'prop-types';

const handleEvent = (event) => {
  event.preventDefault();
  if (event.charCode === 32 || event.charCode === 13) {
    // event.target.setAttribute('tabIndex', '-1');

    const chk = event.target.querySelectorAll('input');
    chk[0].focus();
    for (let i = 0; i < chk.length; i += 1) {
      chk[i].setAttribute('tabIndex', '0');
    }
  }
};

const FilterCheckboxGroup = props => (
  <div className="row" style={{ backgroundColor: '#ffffff' }} tabIndex="0" onKeyPress={handleEvent}>
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

