import React from 'react';
import PropTypes from 'prop-types';

const handleEvent = (event) => {
  event.preventDefault();
  console.log('hey');
  if (event.charCode === 37 || event.charCode === 40) {
    const chk = event.target.querySelectorAll('input');
    chk[0].focus();
    for (let i = 0; i < chk.length; i += 1) {
      console.log(chk[i]);
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

