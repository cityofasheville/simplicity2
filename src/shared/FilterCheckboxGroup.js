import React from 'react';
import PropTypes from 'prop-types';

const handleEvent = (event) => {
  event.preventDefault();
  if (event.charCode === 32 || event.charCode === 13) {
    // event.target.setAttribute('tabIndex', '-1');

    const chk = event.target.children;
    console.log(event.target);
    console.log(chk[0]);
    chk[0].focus();
    const i = 0;
    for (i; i < chk.length; i + 1) {
      chk[i].setAttribute('tabIndex', '0');
    }
  }
}

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

