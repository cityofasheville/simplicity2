import React from 'react';
import { IndexLink } from 'react-router';

const CityInfoBar = () => (
  <div>
    <div className="navbar navbar-default text-primary navbar-fixed-top" style={{ fontSize: '30px', backgroundColor: '#f6fcff' }}>
      <div className="pull-left" style={{ marginRight: '5px', marginTop: '5px', marginBottom: '5px', marginLeft: '15px' }}>
        <IndexLink to="/"><img src={require('./citylogo-flatblue.png')} width="80px" height="80px" alt="City of Asheville logo"></img></IndexLink>
      </div>
      <div className="navbar-header">
        <div className="pull-left">
          <div style={{ marginTop: '10px', marginBottom: '-22px' }}>Dashboards</div>
          <IndexLink to="/" style={{ fontSize: '12px', fontStyle: 'italic' }}>City of Asheville, NC</IndexLink>
        </div>
      </div>
    </div>
    <div className="pull-right" style={{ color: '#bf1bbf', fontStyle: 'italic', float: 'right', fontSize: '19px', padding: '5px 15px', lineHeight: '1' }}>
      <a href="https://goo.gl/forms/XC9l7PTylog6Q9B83" target="_blank" style={{ color: '#bf1bbf', fontStyle: 'italic', fontSize: '16px' }}>Click here to give feedback or sign up for user testing</a>
    </div>
  </div>
);

export default CityInfoBar;
