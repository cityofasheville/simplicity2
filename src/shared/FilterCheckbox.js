import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, CheckboxGroupContext } from 'accessible-react-checkbox-group';
import { generate } from 'namor';
import '../styles/components/filterCheckbox.scss';


class FilterCheckbox extends React.Component {
  state = {
    id: generate({ words: 2 }),
    parentId: generate({ words: 2 }),
    labelId: generate({ words: 2 }),
  };

  handleClick = (event) => {
    // event.stopPropagation();
    this.props.onChange(this.props.value, event);
  };

  handleKeyDown = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.props.onChange(this.props.value, event);
    }
  };

  render() {
    const mainStyle = this.props.disabled ? 'filterCheckboxDisabled' : this.props.checked ? 'filterCheckbox' : 'unchecked';
    const backgroundStyle = this.props.checked ? 'backgroundChecked' : 'backgroundUnchecked';

    return (
      <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" style={{ cursor: 'pointer' }}>
        <div
          id={this.state.parentId}
          className={mainStyle}
          onClick={this.handleClick}
          tabIndex="0"
          onKeyDown={this.handleKeyDown}
          role="checkbox"
          aria-checked={this.props.checked}
          aria-labelledby={this.state.labelId}
        >
          <div className={backgroundStyle} style={{ paddingTop: '10px' }}>
            <div className="text-center text-primary" style={{ minHeight: this.props.minHeight }}>
              <Checkbox
                role="presentation"
                id={this.state.id}
                tabIndex="-1"
                value={this.props.value}
                style={{ marginRight: '7px' }}
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.preventDefault()}
                onMouseUp={() => document.getElementById(this.state.parentId).focus()}
              />
              <label
                id={this.state.labelId}
                role="presentation"
                htmlFor={this.state.id}
                onClick={e => e.preventDefault()}
                style={{ fontWeight: 'normal', cursor: 'pointer' }}
              >
                {this.props.label}
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FilterCheckbox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  minHeight: PropTypes.string,
};

FilterCheckbox.defaultProps = {
  label: undefined,
  value: undefined,
  disabled: false,
  minHeight: '30px',
};

export default props => (
  <CheckboxGroupContext.Consumer>
    {({ name, checkedValues, onChange }) => (
      <FilterCheckbox
        {...props}
        checkboxGroupName={name}
        checked={checkedValues.indexOf(props.value) >= 0}
        onChange={onChange}
      />
    )}
  </CheckboxGroupContext.Consumer>
);
