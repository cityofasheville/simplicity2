import React from 'react';
import PropTypes from 'prop-types';

const handleEvent = (event) => {
  if(event.keyCode == 9) {}
  else {
    event.preventDefault();
    event.target.removeAttribute('tabIndex');
    if (event.keyCode === 39 || event.keyCode === 40 || event.keyCode === 13) {
      const chk = event.target.querySelectorAll('input');
      chk[0].focus();
      for (let i = 0; i < chk.length; i += 1) {
        console.log(chk[i]);
        chk[i].setAttribute('tabIndex', '0');
      }
    }
  }
};

const FilterCheckboxGroup = props => (
  <div className="row" style={{ backgroundColor: '#ffffff' }} tabIndex="0" onMouseUp={e => e.target.blur()} onKeyDown={handleEvent}>
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

