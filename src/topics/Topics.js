import React from 'react';
import { Link } from 'react-router';




const Topics = props => (
  <div className="container">
    <div className="col-md-12">
      <div className="col-xs-12">
        <h4 className="text-primary">TOPICS</h4>
      </div>
      <div className="col-md-4">
        <div className="col-xs-12 topic-tile">
          <div className="row text-center">
            <i className="fa fa-shield fa-5x text-primary" aria-hidden="true"></i>
          </div>
          <h2 className="text-primary text-center">CRIME</h2>
          <hr />
        </div>
      </div>
      <div className="col-md-4">
        <div className="col-xs-12 topic-tile">
          <div className="row text-center">
            <i className="fa fa-building-o fa-5x text-primary" aria-hidden="true"></i>
          </div>
          <Link to="/development"><h2 className="text-primary text-center">DEVELOPMENT</h2></Link>
          <hr />
        </div>
      </div>
    </div>
  </div>
);

Topics.propTypes = {
  children: React.PropTypes.node,
};

export default Topics;
