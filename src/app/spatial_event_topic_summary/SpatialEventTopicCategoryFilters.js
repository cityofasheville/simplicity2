import React from 'react';
import PropTypes from 'prop-types';
import MultiSelect from '../../shared/MultiSelect';

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
      { value: 'Planning Level I', display: 'Planning Level I' },
      { value: 'Planning Level II', display: 'Planning Level II' },
    ],
    values: ['Planning Level I', 'Planning Level II'],
    placeholder: 'All planning levels',
    id: 'development_planning_level',
    name: 'development_planning_level',
    allowNoneSelected: false,
  },
  {
    options: [
      { value: 'Commercial', display: 'Commercial' },
      { value: 'Residential', display: 'Residential' },
      { value: 'Historical', display: 'Historical' },
    ],
    values: ['Commercial', 'Residential', 'Historical'],
    placeholder: 'All planning types',
    id: 'development_types',
    name: 'development_types',
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
              <div key={select.id === undefined ? i : select.id}>
                <label htmlFor={select.id === undefined ? i : select.id} className="offscreen">view</label>
                <MultiSelect options={select.options} values={select.values} placeholder={select.placeholder} allowNoneSelected={select.allowNoneSelected} id={select.id} name={select.name} />
              </div>
            ))
          }
        </div>
      );
    case 'development':
      return (
        <div>
          {
            developmentCategorySelects.map((select, i) => (
              <div key={select.id === undefined ? i : select.id} >
                <label htmlFor={select.id} className="offscreen">view</label>
                <MultiSelect options={select.options} values={select.values} placeholder={select.placeholder} allowNoneSelected={select.allowNoneSelected} id={select.id} name={select.name} />
              </div>
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
    <label htmlFor="MultiSelects" className="col-sm-2 control-label">view</label>
    <div className="col-sm-10">
      {renderCategories(props.spatialEventTopic.toLowerCase())}
    </div>
  </div>
);

SpatialEventTopicCategoryFilters.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
};

export default SpatialEventTopicCategoryFilters;
