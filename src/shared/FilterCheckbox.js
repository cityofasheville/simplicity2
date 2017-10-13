import React from 'react';
import PropTypes from 'prop-types';

const mainStyle = (checked, disable) => {
  const styling = {
    borderRadius: '2px',
    border: checked ? '2px solid #16abe4' : '2px solid #ffffff',
    opacity: disable ? '0.25' : (checked ? '1.0' : '0.75'),
    backgroundColor: '#4077a5',
    marginBottom: '10px',
  }
  return styling;
};
const backgroundStyle = (checked) => {
  const styling = {
    backgroundColor: checked ? '#d3f1ff' : '#eeeeee',
    paddingTop: '10px',
  }
  return styling;
};

const handleFocus = () => {
  const styling = {
    outline: '#4579B3 3px solid',
    outlineOffset: '2px',
  }
  return styling;
}

const handleBlur = () => {
  const styling = {
    outline: '#4579B3 3px solid',
    outlineOffset: '-2px',
  }
  return styling;
}
const FilterCheckbox = props => (
    <div>
      <div style={mainStyle(props.selected, props.disabled)} onClick={props.handleChange}>
        <div style={backgroundStyle(props.selected)}>
          <div className="text-center text-primary" style={{ minHeight: '30px' }}>
            <input type="checkbox" aria-label={props.label} label={props.label} value={props.value} checked={props.selected} readOnly />
            <span>{props.label}</span>
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
};

FilterCheckbox.defaultProps = {
  selected: false,
  disabled: false,
  handleChange: null,
  minHeight: '30px',

}

export default FilterCheckbox;
