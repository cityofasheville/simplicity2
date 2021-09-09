import React from 'react';
import PermitSearchBar from './PermitSearchBar';
// import { browserHistory } from 'react-router';

class PermitSearchIndex extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    return(
      <div>
        <h1 className="">Look Up an Existing Application</h1>
        <PermitSearchBar />
        <div style={{marginTop: "40px"}}>
          <h4>If you don't know the Application ID, you can look it up here: 
          </h4>
          <div style={{fontSize: "1.5em"}}>
          <a href="/permits">Search Map by Date</a>
          </div>
        </div>
      </div>
    );
  }
}

export default PermitSearchIndex;