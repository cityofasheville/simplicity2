import React from 'react';
import PropTypes from 'prop-types';
import TrcTimeline from './TrcTimeline';


class TRCDashboard extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (<div className="row" >
      {/* SEARCH BAR */}
      {/* MAP */}
      <div className="col-md-12" >
        <TrcTimeline/>
      </div>
      {/* CONTEXT */}
      {/* TABLE */}
    </div>);
  }

}

export default TRCDashboard;
