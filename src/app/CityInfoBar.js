import React from 'react';

const CityInfoBar = () => (
  <div>
    <div className="navbar navbar-default text-primary navbar-fixed-top" style={{ fontSize: '30px', backgroundColor: '#f6fcff' }}>
      <div className="pull-left" style={{ marginRight: '5px', marginTop: '5px', marginBottom: '5px', marginLeft: '15px' }}>
        <a href="http://www.ashevillenc.gov" target="_blank"><img src={require('./citylogo-flatblue.png')} width="80px" height="80px" alt="City of Asheville logo"></img></a>
      </div>
      <div className="navbar-header">
        <div className="pull-left">
          <div style={{ marginTop: '10px', marginBottom: '-22px' }}>Dashboards</div>
          <a href="http://www.ashevillenc.gov" target="_blank" style={{ fontSize: '12px', fontStyle: 'italic' }}>City of Asheville, NC</a>
        </div>
      </div>
    </div>
    <div className="pull-right" style={{ color: '#bf1bbf', fontStyle: 'italic', float: 'right', fontSize: '19px', padding: '5px 15px', lineHeight: '1' }}>
      Beta:&nbsp;
      <a href="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1" target="_blank" style={{ color: '#bf1bbf', fontStyle: 'italic', fontSize: '16px' }}>Click here to give feedback or sign up for user testing</a>
    </div>
  </div>
);

export default CityInfoBar;
