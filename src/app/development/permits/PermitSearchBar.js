import React from 'react';
// import { browserHistory } from 'react-router';
import PermitSearchResults from './PermitSearchResults';

class PermitSearchBar extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      labelClass: 'text-primary',
      labelText: 'Enter application ID or address',
      searchValue: '',
      searchTarget: '',
      formSubmitted: false,
      showPermitsForID: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddressSelection = this.handleAddressSelection.bind(this);
    this.handleFormSubmission = this.handleFormSubmission.bind(this);
  }

  handleChange(e) {
    this.setState({
      searchValue: e.target.value,
      formSubmitted: false,
    });
  }

  handleAddressSelection(e) {
    console.log(e.target.dataset.address);
    const newVal = (parseInt(e.target.dataset.address) === parseInt(this.state.showPermitsForID)) ? 0 : parseInt(e.target.dataset.address);
    this.setState({
      showPermitsForID: newVal,
    });
  }

  handleFormSubmission(e) {

    // var permitFormatA = /^\d{2}-\d{5}$/;
    // var permitFormatB = /^\d{2}-\d{5}[a-zA-Z]{0,2}$/;
    e.preventDefault();
    console.log(e.target.permitSearch.value);

    const permitFormat = /^\d{2}-\d{5}(s|S|pz|pZ|Pz|PZ){0,1}$/;
    const suppliedValue = this.state.searchValue;

    if (suppliedValue.length <= 3) {
      this.setState({
        labelClass: 'text-danger',
        labelText: 'Please enter a valid application ID (e.g. 20-00965) or more than three characters of an address',
      });
      console.log(`Invalid Entry - ${suppliedValue}`); 
    }
    else {
      if (suppliedValue.search(permitFormat) === -1) { 
        this.setState({
          labelClass: 'text-primary',
          labelText: 'Enter application ID or address',    
          searchValue: suppliedValue,
          searchTarget: 'address',
          formSubmitted: true,
        });
        console.log(`Not a permit, will search as address - ${suppliedValue}`); 
      }
      else { 
        this.setState({
          labelClass: 'text-primary',
          labelText: 'Enter application ID or address',    
          searchValue: suppliedValue,
          searchTarget: 'permit',
          formSubmitted: true,
        });
        console.log(`Valid Application ID - ${suppliedValue}`); 
      }  
    }
  }

  render() {
    console.log('state in render: ', this.state);
    return(
      <div>
        <form onSubmit={(e) => this.handleFormSubmission(e)}>
          <label id="permitSearchLabel" htmlFor="permitSearch" className={this.state.labelClass}>{this.state.labelText}</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 20-00965"
              id="permitSearchInput"
              name="permitSearch"
              value={this.state.searchValue}
              // onKeyUp={this.handleKeyUp}
              onChange={this.handleChange}
            />
            <span className="input-group-btn">
              <input 
                className="btn btn-primary" 
                type="submit" 
                value="Search" 
                // onClick={() => this.handleFormSubmission()}
                aria-label="Search" /> 
            </span>
          </div>
        </form>
        {this.state.formSubmitted &&
          <PermitSearchResults 
            searchText={this.state.searchValue} 
            searchTarget={this.state.searchTarget} 
            handleAddressSelection={this.handleAddressSelection} 
            showPermitsForID={this.state.showPermitsForID} 
          />      
        }
      </div>
    );
  }
}

export default PermitSearchBar;