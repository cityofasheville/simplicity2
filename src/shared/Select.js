import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.selected };
    this.options = props.options;
    this.value = props.value;
    this.name = props.name;
    this.id = props.id;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      selected: event.target.value,
    });
  }

  render() {
    return (
      <select value={this.state.value} onChange={this.handleChange} name={this.name} id={this.id} className="form-control" defaultValue={this.value}>
        {this.options.map((option, i) => (
          <option value={option.value} key={[this.name, 'option', i].join('_')} name={this.name}>{option.display}</option>
        ))}
      </select>
    );
  }
}

const optionShape = {
  value: PropTypes.string,
  display: PropTypes.string,
};

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape(optionShape)),
  value: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
};

export default Select;

