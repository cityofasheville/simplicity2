import React from 'react';
import PropTypes from 'prop-types';
import RadioButton from './RadioButton';

class RadioButtonGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected,
    };
  }

  handleChange(value) {
    this.setState({
      selected: value,
    });
    if (this.props.onClickCallback !== undefined) {
      this.props.onClickCallback(value);
    }
  }

  render() {
    return (
      <div>
        {this.props.radios.map((radio, index) => ( // eslint-disable-line
          <RadioButton
            key={['radio', index].join('_')}
            name={radio.name}
            display={radio.display}
            checked={this.state.selected === radio.value}
            onClick={() => (this.handleChange(radio.value))}
            inline={this.props.inline}
          />
        ))}
      </div>
    );
  }
}

const radioDataShape = {
  value: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  display: PropTypes.string,
};

RadioButtonGroup.PropTypes = {
  selected: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  radios: PropTypes.arrayOf(PropTypes.shape(radioDataShape)),
  inline: PropTypes.bool,
  onClickCallback: PropTypes.func,
};

RadioButtonGroup.DefaultProps = {
  inline: false,
};

export default RadioButtonGroup;
