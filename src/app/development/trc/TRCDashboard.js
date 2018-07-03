import React from 'react';
import PropTypes from 'prop-types';
import Timeline from './Timeline';


class TRCDashboard extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (<div className="row" >
      {/* SEARCH BAR */}
      {/* MAP */}
      <div className="col-md-12" >
        <Timeline/>
      </div>
      {/* CONTEXT */}
      {/* TABLE */}
    </div>);
  }

}

export default TRCDashboard;
