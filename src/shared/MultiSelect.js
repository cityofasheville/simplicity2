import React from 'react';
import PropTypes from 'prop-types';
import { Select, Trigger, OptionList, Option, utils } from 'selectly/lib/Selectly';
const { getToggledValues } = utils;

// inspired by http://codepen.io/souporserious/pen/vGRZQL

const CheckboxOption = props => (
  <Option className="react-select-option" value={props.value}>
    <input
      type="checkbox"
      className="react-select-option__checkbox"
      defaultValue={null}
      checked={props.isChecked}
      readOnly
    />
    <div className="react-select-option__label">
      {props.children}
    </div>
  </Option>
);

CheckboxOption.propTypes = {
  value: PropTypes.string,
  isChecked: PropTypes.bool,
  children: PropTypes.node,
};

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.options = props.options;
    this.name = props.name;
    this.id = props.id;
    this.originalValues = props.values;
    this.allowNoneSelected = props.allowNoneSelected;
    this.state = {
      defaultValue: props.placeholder,
      currentValues: props.values,
    };
    this.handleChange = this.handleChange.bind(this);
    this.resetToDefault = this.resetToDefault.bind(this);
  }

  handleChange(obj) {
    this.setState({
      currentValues: getToggledValues(this.state.currentValues, obj.value),
    });
    if (!this.allowNoneSelected && this.state.currentValues.length - 1 === 0) {
      this.resetToDefault();
    }
  }

  resetToDefault() {
    this.setState({
      currentValues: this.originalValues,
    });
  }

  render() {
    const { defaultValue, currentValues } = this.state;
    return (
      <div className="form-control multiSelect" name={this.name}>
        <Select
          multiple
          onChange={this.handleChange}
        >
          <Trigger>
            { currentValues.length > 0 ?
              currentValues.map((value, i) => (
                <div className="selectedMultiOption" key={i}>{value}</div>
              )) : defaultValue
            }
            { currentValues.length > 0 ? <i className="fa fa-refresh multiSelectRefresh" onClick={this.resetToDefault}></i> : ''}
          </Trigger>
          <OptionList tag="ul" className="react-select-menu">
            {this.options.map((option, i) => (
              <CheckboxOption key={[this.name, 'option', i].join('_')} value={option.value} isChecked={currentValues.includes(option.value)}>{option.display}</CheckboxOption>
            ))}
          </OptionList>
        </Select>
      </div>
    );
  }
}

const optionShape = {
  value: PropTypes.string,
  display: PropTypes.string,
};

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape(optionShape)),
  values: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  allowNoneSelected: PropTypes.bool,
};

MultiSelect.defaultProps = {
  options: [
    { value: 'red', display: 'Red' },
    { value: 'green', display: 'Green' },
    { value: 'blue', display: 'Blue' },
  ],
  values: [],
  placeholder: 'All options',
  allowNoneSelected: true,
};

export default MultiSelect;
