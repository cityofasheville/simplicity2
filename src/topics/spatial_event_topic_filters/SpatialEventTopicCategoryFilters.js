import React from 'react';
import MultiSelect from '../../components/MultiSelect';

const crimeCategorySelects = [
  {
    options: [
      { value: 'Aggravated assault', display: 'Aggravated assault' },
      { value: 'Burglary', display: 'Burglary' },
      { value: 'Larceny', display: 'Larceny' },
      { value: 'Larceny of a Motor Vehicle', display: 'Larceny of a Motor Vehicle' },
      { value: 'Robbery', display: 'Robbery' },
      { value: 'Vandalism', display: 'Vandalism' },
    ],
    values: ['Aggravated assault', 'Burglary', 'Larceny', 'Larceny of a Motor Vehicle', 'Robbery', 'Vandalism'],
    placeholder: 'All crimes',
    id: 'crimes',
    name: 'crimes',
    allowNoneSelected: false,
  },
];

const developmentCategorySelects = [
  {
    options: [
      { value: 'Aggravated assault', display: 'Residential' },
      { value: 'Burglary', display: 'Burglary' },
      { value: 'Larceny', display: 'Larceny' },
      { value: 'Larceny of a Motor Vehicle', display: 'Larceny of a Motor Vehicle' },
      { value: 'Robbery', display: 'Robbery' },
      { value: 'Vandalism', display: 'Vandalism' },
    ],
    values: ['Aggravated assault', 'Burglary', 'Larceny', 'Larceny of a Motor Vehicle', 'Robbery', 'Vandalism'],
    placeholder: 'All crimes',
    id: 'crimes',
    name: 'crimes',
    allowNoneSelected: false,
  },
];

const renderCategories = (spatialEventTopic) => {
  switch (spatialEventTopic) {
    case 'crime':
      return (
        <div>
          {
            crimeCategorySelects.map((select, i) => (
              <MultiSelect key={select.id === undefined ? i : select.id} options={select.options} values={select.values} placeholder={select.placeholder} allowNoneSelected={select.allowNoneSelected} id={select.id} name={select.name} />
            ))
          }
        </div>
      );
    default:
      return [];
  }
};

const SpatialEventTopicCategoryFilters = props => (
  <div className="form-group">
    <label htmlFor="MultiSelects" className="col-sm-2 control-label">View</label>
    <div className="col-sm-10">
      {renderCategories(props.spatialEventTopic)}
    </div>
  </div>
);

SpatialEventTopicCategoryFilters.propTypes = {
  spatialEventTopic: React.PropTypes.string.isRequired,
};

export default SpatialEventTopicCategoryFilters;
