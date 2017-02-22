import React from 'react';
import BarChart from '../../components/BarChart';
import styles from './spatialEventTopicSummaryStyles.css';

const testData = [{ name: 'Category 1', value: 12345 },
  { name: 'Category 2', value: 4000 },
];

const SpatialEventTopicSummary = props => (
  <div>
    <div className="row">
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
    <form className="row form-horizontal">
      <div className="col-xs-12">
        <fieldset className={styles.filtersDiv}>
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
            <label htmlFor="extent" className="col-sm-2 control-label">spatialPrep</label>
            <div className="col-sm-10">
              <span className={['form-control-static', styles.formControlStatic].join(' ')}>SpatialInfo</span>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-offset-2 col-sm-10">
              <div className="panel-group">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">
                      <a data-toggle="collapse" href="#collapse1"> Categories</a>
                      <i className="fa fa-chevron fa-fw pull-right" ></i>
                    </h4>
                  </div>
                  <div id="collapse1" className="panel-collapse in">
                    <div className="panel-body">
                      <div className="checkbox">
                        <label htmlFor="cat1" ><input type="checkbox" value="" />Category 1 </label>
                      </div>
                      <div className="checkbox">
                        <label htmlFor="cat2"><input type="checkbox" value="" />Category 2 </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </form>

    <div className="row">
      <div className="col-xs-12">
        <div className="btn-group pull-right">
          <button className="btn btn-primary">Summary</button>
          <button className="btn btn-primary">Details view</button>
          <button className="btn btn-primary">Map view</button>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-xs-12" style={{ height: '400px' }}>
        <BarChart data={testData} chartTitle="Topic BarChart" barDataKeys={['value']} xAxisDataKey="name" />
      </div>

      <div className="col-xs-12">
        <div className={styles.topicSummaryList} style={{ display: 'none' }}>
          <div className={['row', styles.topicSummaryListItem].join(' ')}>
            <div className="col-xs-12">
              <div className="row">
                <span className={['col-xs-12', styles.categoryTitle].join(' ')}>Larceny</span>
                <span className={['col-sm-8 col-xs-12', styles.listTitle].join(' ')}>123 Main Street</span>
                <span className={['col-sm-4 col-xs-12', styles.listSubTitle].join(' ')}>01/01/2001</span>
              </div>
            </div>
            <div className="col-sm-4">
              <span className={styles.columnTitle}>Case #<br /></span>
              <span className={styles.columnValue}>12345</span>
            </div>
            <div className="col-sm-4">
              <span className={styles.columnTitle}>Law beat<br /></span>
              <span className={styles.columnValue}>AC2</span>
            </div>
            <div className="col-sm-4">
              <span className={styles.columnTitle}>Severity<br /></span>
              <span className={styles.columnValue}>Property</span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xs-12" style={{ display: 'none' }}>
        Map view
      </div>
    </div>
  </div>
);

SpatialEventTopicSummary.propTypes = {
  
};

export default SpatialEventTopicSummary;
