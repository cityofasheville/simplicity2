import React from 'react';
import { Select, Trigger, OptionList, Option, utils } from 'selectly/lib/Selectly';
const { getToggledValues } = utils;

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: 'Select a color',
      currentValues: [],
    };
  }

  handleChange(value) {
    this.setState({
      currentValues: getToggledValues(this.state.currentValues, value),
    });
  }

  render() {
    const { defaultValue, currentValues } = this.state;
    return (
      <Select
        multiple
        onChange={value => this.handleChange(value)}
      >
        <Trigger>
          { currentValues.length > 0 ?
            currentValues.map((value, i) => (
              <span key={i}>{value.value}</span>
            )) : defaultValue
          }
        </Trigger>
        <OptionList tag="ul" className="react-select-menu">
          <Option value="red">Red</Option>
          <Option value="green">Green</Option>
          <Option value="blue">Blue</Option>
        </OptionList>
      </Select>
    );
  }
}

export default MultiSelect;
