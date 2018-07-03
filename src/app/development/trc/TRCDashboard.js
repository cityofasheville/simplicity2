import React from 'react';
import PropTypes from 'prop-types';
import Timeline from './Timeline';


class TRCDashboard extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (<div style={{width: '100%', height: '100%'}}>
      {/* SEARCH BAR */}
      {/* MAP */}
      <Timeline/>
      {/* CONTEXT */}
      {/* TABLE */}
    </div>);
  }

}

export default TRCDashboard;
