import React from 'react';
import PropTypes from 'prop-types';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = { checked: props.checked };
    this.label = props.label;
    this.value = props.value;
    this.toggleChecked = this.toggleChecked.bind(this);
    this.onChangeCallback = props.onChangeCallback;
  }

  toggleChecked() {
    this.setState({
      checked: !this.state.checked,
    });
    if (this.props.onChangeCallback !== undefined) {
      this.props.onChangeCallback(!this.state.checked);
    }
  }

  render() {
    return (
      <input type="checkbox" label={this.label} value={this.value} checked={this.state.checked} onChange={this.toggleChecked} />
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool,
  onChangeCallback: PropTypes.func,
};

export default Checkbox;
