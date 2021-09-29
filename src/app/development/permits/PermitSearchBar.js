import React from 'react';
// import { browserHistory } from 'react-router';

class PermitSearch extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      labelClass: 'text-primary',
      labelText: 'Enter Application ID',
      searchValue: ''
    };
  }

  handleChange = (e) => {
    this.setState({
      searchValue: e.target.value
    });
  }

  handleFormSubmission = (e) => {
    e.preventDefault(); 

    // var permitFormatA = /^\d{2}-\d{5}$/;
    // var permitFormatB = /^\d{2}-\d{5}[a-zA-Z]{0,2}$/;
    var permitFormat = /^\d{2}-\d{5}(s|S|pz|pZ|Pz|PZ){0,1}$/;
    var check = this.state.searchValue;
    if (check.search(permitFormat) === -1) { 
      this.setState({
        labelClass: 'text-danger',
        labelText: 'Please Enter a Valid Application ID (e.g. 20-00965)',
      });
      console.log(`Invalid Application ID - ${check}`); 
    }
    else { 
      console.log(`Valid Application ID - ${check}`); 
      window.open(`/permits/${check}`, '_self');
      // browserHistory.push(`/permits/${check}`);
    }
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleFormSubmission}>
          <label id="permitSearchLabel" htmlFor="permitSearch" className={this.state.labelClass}>{this.state.labelText}</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 20-00965"
              id="permitSearchInput"
              name="permitSearch"
              onChange={this.handleChange}
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