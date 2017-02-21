import React from 'react';

const SpatialEventTopicSummary = props => (
  <div className="row">
    <div className="col-xs-12">
      <h1 className="col-xs-6">Topic</h1>
      <div className="col-xs-6">
        <a className="pull-right text-center" style={{ padding: '10px' }}>
          <i className="fa fa-download"></i><br />Download
        </a>
        <a className="pull-right text-center" style={{ padding: '10px' }}>
          <i className="fa fa-envelope-o"></i><br />Email
        </a>
      </div>
    </div>
    <form className="form-horizontal col-xs-12">
      <div className="form-group">
        <label htmlFor="time" className="col-sm-2 control-label">during</label>
        <div className="col-sm-10">
          <select name="time" id="time" className="form-control">
            <option value="0">the last 30 days</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="extent" className="col-sm-2 control-label">within</label>
        <div className="col-sm-10">
          <select name="extent" id="extent" className="form-control">
            <option value="0">a couply city blocks (1/8 mile)</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="extent" className="col-sm-2 control-label">spatialPreposition</label>
        <div className="col-sm-10">
          <span className="form-control-static">SpatialInfo</span>
        </div>
      </div>
      <div className="panel-group">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4 className="panel-title">
              <a data-toggle="collapse" href="#collapse1">Categories</a>
            </h4>
          </div>
          <div id="collapse1" className="panel-collapse collapse">
            <div className="panel-body">Panel Body</div>
          </div>
        </div>
      </div>
    </form>


  </div>
);

SpatialEventTopicSummary.propTypes = {
  
};

export default SpatialEventTopicSummary;
