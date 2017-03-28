import React from 'react';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = { checked: props.checked };
    this.label = props.label;
    this.value = props.value;
    this.toggleChecked = this.toggleChecked.bind(this);
  }

  toggleChecked() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  render() {
    return (
      <input type="checkbox" label={this.label} value={this.value} checked={this.state.checked} onClick={this.toggleChecked} />
    );
  }
}

Checkbox.propTypes = {
  label: React.PropTypes.string,
  value: React.PropTypes.string,
  checked: React.PropTypes.bool,
};

export default Checkbox;
