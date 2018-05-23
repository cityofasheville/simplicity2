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
    if (!this.props.disabled) {
      this.props.onChange(this.props.value, event);
    }
  };

  handleKeyDown = (event) => {
    if (!this.props.disabled && event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.props.onChange(this.props.value, event);
    }
  };

  render() {
    const mainStyle = this.props.disabled
      ? 'filterCheckbox filterCheckbox--disabled'
      : this.props.checked
        ? 'filterCheckbox filterCheckbox--checked'
        : 'filterCheckbox filterCheckbox--unchecked';
    const backgroundStyle = this.props.checked
      ? 'filterCheckbox filterCheckbox--backgroundChecked'
      : 'filterCheckbox filterCheckbox--backgroundUnchecked';

    return (
      <div className="checkboxGroup__checkbox disabledCursor" style={{ cursor: 'pointer' }}>
        <div
          id={this.state.parentId}
          className={`${backgroundStyle} ${mainStyle}`}
          onClick={this.handleClick}
          tabIndex={this.props.disabled ? undefined : '0'}
          onKeyDown={this.handleKeyDown}
          role="checkbox"
          aria-checked={this.props.checked}
          aria-labelledby={this.state.labelId}
          disabled={this.props.disabled}
        >
          <div
            className="text-center text-primary" /* style={{ minHeight: this.props.minHeight }} */
          >
            <Checkbox
              role="presentation"
              id={this.state.id}
              tabIndex="-1"
              value={this.props.disabled ? false : this.props.value}
              style={{ marginRight: '7px' }}
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.preventDefault()}
              onMouseUp={() => document.getElementById(this.state.parentId).focus()}
              disabled={this.props.disabled}
            />
            <label
              id={this.state.labelId}
              role="presentation"
              htmlFor={this.state.id}
              onClick={e => e.preventDefault()}
              style={{
                fontWeight: 'normal',
                cursor: this.props.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {this.props.label}
            </label>
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
    {({ checkedValues, onChange }) => (
      <FilterCheckbox
        {...props}
        checked={checkedValues.indexOf(props.value) >= 0}
        onChange={onChange}
      />
    )}
  </CheckboxGroupContext.Consumer>
);
