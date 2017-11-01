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
  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" style={{ cursor: 'pointer' }} tabIndex="-1">
      <div className={mainStyle(props.selected, props.disabled)} onMouseUp={e => e.target.blur()} tabIndex="-1" onClick={props.handleChange}>
        <div className={backgroundStyle(props.selected)} style={{ paddingTop: '10px' }}>
          <div className="text-center text-primary" style={{ minHeight: '30px' }}>
            <input tabIndex="-1" style={{ marginRight: '7px' }}type="checkbox" aria-label={props.label} label={props.label} value={props.value} checked={props.selected} onMouseUp={e => e.target.blur()} readOnly />
            <label style={{ fontWeight: 'normal' }}>{props.label}</label>
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
