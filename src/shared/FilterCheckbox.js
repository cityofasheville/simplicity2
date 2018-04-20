import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/filterCheckbox.scss';

class FilterCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.selected
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  handleClick(event) {
    //event.preventDefault();
    if(this.props.handleChange != null)
      this.props.handleChange();
    this.setState({
      checked: !this.state.checked,
    });
  }

  handleKey(event) {
    if(event.keyCode === 13) {
      event.preventDefault();
      if(this.props.handleChange != null)
        this.props.handleChange();
      this.setState({
        checked: !this.state.checked,
      });
    }
  }

  render() {
    const mainStyle = this.props.disabled ? 'filterCheckbox filterCheckbox--disabled' : this.state.checked ? 'filterCheckbox filterCheckbox--checked' : 'filterCheckbox filterCheckbox--unchecked';
    const backgroundStyle = this.state.checked ? 'filterCheckbox filterCheckbox--backgroundChecked' : 'filterCheckbox filterCheckbox--backgroundUnchecked';

    return (
        <div className="checkboxGroup__checkbox" style={{cursor: 'pointer'}}
             onMouseUp={e => e.target.blur()}
             tabIndex="-1">
          <div className={backgroundStyle + ' ' + mainStyle} onMouseUp={e => e.target.blur()} tabIndex="-1"
               onClick={this.handleClick}>
            <div onMouseUp={e => e.target.blur()} tabIndex="-1">
              <div className="text-center text-primary" onMouseUp={e => e.target.blur()} tabIndex="-1">
                <input tabIndex="-1" type="checkbox" aria-label={this.props.label}
                       label={this.props.label} value={this.props.value} checked={this.state.checked} onKeyDown={this.handleKey} onMouseUp={e => e.target.blur()}
                       readOnly/>
                <label style={{fontWeight: 'normal', cursor: 'pointer'}} onMouseUp={e => e.target.blur()} tabIndex="-1">{this.props.label}</label>
              </div>
            </div>
          </div>
        </div>
      )
  }
}

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
