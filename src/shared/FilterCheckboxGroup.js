import React from 'react';
import PropTypes from 'prop-types';

class FilterCheckboxGroup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      focus: 0,
      firstTime: true,
      chkArr: null,
    };
    this.handleEvent = this.handleEvent.bind(this);
    //console.log(this.state.chkArr);
  }

  componentDidMount() {
    this.setState ({
      chkArr: document.getElementById(this.props.id).querySelectorAll('input'),
    });
  }

  handleEvent (event) {
    //console.log(this.state.chkArr);
    if (event.keyCode == 9) {
    }
    else if (event.keyCode === 37|| event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40 || event.keyCode === 13) {
      event.preventDefault();

      if (document.activeElement === document.getElementById(this.props.id)) {
        console.log('first time');
        this.state.chkArr[this.state.focus].focus();
        this.setState({firstTime: false});
      }
      else if (event.keyCode === 37 || event.keyCode === 38) {
        console.log('go left');
        this.setState({focus: this.state.focus -= 1,});
        if (this.state.focus < 0) {
          document.getElementById(this.props.id).focus();
          this.setState({focus: 0});
        }
        else this.state.chkArr[this.state.focus].focus();
      }
      else if (event.keyCode === 39 || event.keyCode === 40) {
        console.log('go right');
        this.setState({focus: this.state.focus += 1,});
        if (this.state.focus === this.state.chkArr.length) {
          document.getElementById(this.props.id).focus();
          this.setState({focus: 0});
        }
        else this.state.chkArr[this.state.focus].focus();
      }
    }
  }

  render () {
    return (
      <div className="row" id={this.props.id} style={{backgroundColor: '#ffffff'}} tabIndex="0" onMouseUp={e => e.target.blur()} onKeyDown={this.handleEvent}>
        { this.props.children }
      </div>
    );
  }
}

FilterCheckboxGroup.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  focus: PropTypes.number,
};

FilterCheckboxGroup.defaultProps = {
  children: null,
  id: 'checkboxGroup',
  focus: 0,
};

export default FilterCheckboxGroup;

