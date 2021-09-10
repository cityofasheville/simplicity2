import React from 'react';
import { Link } from 'react-router'
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
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>
          Don't know the application ID? 
        </h2>
        <Link to="/permits">Search our map and filter by date</Link>
      </div>
    );
  }
}

export default PermitSearchIndex;