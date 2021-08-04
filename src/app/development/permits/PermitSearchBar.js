import React from 'react';
import { browserHistory } from 'react-router';

class PermitSearch extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      labelClass: 'text-primary',
      labelText: 'Enter Application ID',
      // searchValue: ''
    };
  }

  handleFormSubmission(value) {
    var permitFormatA = /^\d{2}-\d{5}$/;
    var permitFormatB = /^\d{2}-\d{5}[a-zA-Z]{0,2}$/;
    var check = value;
    if (check.search(permitFormatB) === -1) { 
      this.setState({
        labelClass: 'text-danger',
        labelText: 'Please Enter a Valid Application ID (e.g. 20-00965)',
        // searchValue: value
      });
      // document.getElementById('permitSearchLabel').className = 'text-danger';
      // document.getElementById('permitSearchLabel').innerHTML = 'Please Enter a Valid Permit ID (e.g. 20-00965)';
      console.log(`Invalid Application ID - ${value}`); 
    }
    else { 
      console.log(`Valid Application ID - ${value}`); 
      browserHistory.push(`/permits/${value}`);
    }
  }

  render() {
    return(
      <div>
        <form onSubmit={(e) => { e.preventDefault(); this.handleFormSubmission(document.getElementById('permitSearchInput').value); }} target="_parent">
          <label id="permitSearchLabel" htmlFor="permitSearch" className={this.state.labelClass}>{this.state.labelText}</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 20-00965"
              id="permitSearchInput"
              name="permitSearch"
            />
            <span className="input-group-btn">
              <input className="btn btn-primary" type="submit" value="Load Application" aria-label="Load Application by ID" /> 
            </span>
          </div>
        </form>
      </div>
    );
  }
}

export default PermitSearch;