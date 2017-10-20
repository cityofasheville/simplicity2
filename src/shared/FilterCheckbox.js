import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/filterCheckbox.scss';

const mainStyle = (checked, disable) => {
  if (disable) {
    return 'filterCheckboxDisabled';
  }
  if (checked) {
    return 'filterCheckbox';
  }
  return 'unchecked';

};
const backgroundStyle = (checked) => {
  if (checked) {
    return 'backgroundChecked';
  }
  return 'backgroundUncheck';
};

const FilterCheckbox = props => (
    <div>
      <div className={mainStyle(props.selected, props.disabled)} onClick={props.handleChange}>
        <div className={backgroundStyle(props.selected)} style={{ paddingTop: '10px' }}>
          <div className="text-center text-primary" style={{ minHeight: '30px' }}>
            <input style={{ marginRight: '7px' }}type="checkbox" aria-label={props.label} label={props.label} value={props.value} checked={props.selected} readOnly />
            <label>{props.label}</label>
          </div>
        </div>
      </div>
    </div>
  )
FilterCheckbox.propTypes = {
  label: PropTypes.string,  //category
  value: PropTypes.string,  //text
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  minHeight: PropTypes.string,
  focus: PropTypes.bool,
};

FilterCheckbox.defaultProps = {
  selected: false,
  disabled: false,
  handleChange: null,
  minHeight: '30px',
  focus: false,

}

export default FilterCheckbox;
