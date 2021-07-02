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
      </div>
    );
  }
}

export default PermitSearchIndex;