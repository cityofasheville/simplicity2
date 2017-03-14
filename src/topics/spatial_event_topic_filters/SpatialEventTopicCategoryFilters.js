import React from 'react';

const getCategories = (spatialEventTopic) => {
  switch (spatialEventTopic) {
    case 'Crime':
      return ['Aggravated assault', 'Burglary', 'Larceny', 'Larceny of Motor Vehicle', 'Robbery', 'Vandalism'];
    default:
      return [];
  }
};

const renderCategories = (spatialEventTopic) => {
  const categories = getCategories(spatialEventTopic);
  return categories.map((category, i) => (
    <div className="checkbox" key={i}>
      <label htmlFor={category}><input type="checkbox" value={i} name={category} defaultChecked />{category}</label>
    </div>
  ));
};

const SpatialEventTopicCategoryFilters = props => (
  <div className="row">
    <label htmlFor="categoriesPanel" className="control-label col-sm-2">view</label>
    <div className="col-sm-10">
      <div className="panel-group">
        <div className="panel panel-default" name="categoriesPanel">
          <div className="panel-heading">
            <h4 className="panel-title">
              <a data-toggle="collapse" href="#collapse1"> All crimes</a>
              <i className="fa fa-chevron fa-fw pull-right" ></i>
            </h4>
          </div>
          <div id="collapse1" className="panel-collapse collapse">
            <div className="panel-body">
              {renderCategories(props.spatialEventTopic)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

SpatialEventTopicCategoryFilters.propTypes = {
  spatialEventTopic: React.PropTypes.string.isRequired,
};

export default SpatialEventTopicCategoryFilters;
