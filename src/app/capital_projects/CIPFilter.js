import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import { urlCategory } from './cip_utilities';
import FilterCheckboxGroup from '../../shared/FilterCheckboxGroup';
import FilterCheckbox from '../../shared/FilterCheckbox';
import { refreshLocation } from '../../utilities/generalUtilities';

const CIPFilter = (props) => {
  const toggleMode = () => (
    {
      mode: props.location.query.mode === 'bond' ? 'all' : 'bond',
    }
  );

  const getNewUrlParams = (category) => {
    if (props.selected.length === 1 && props.selected[0] === category) { //can't deselect last one
      return;
    }
    let newSelected = props.selected.slice();
    const selectedIndexInCurrent = props.selected.indexOf(category);
    if (!(props.location.query.mode === 'bond' && !['Parks', 'Housing', 'Transportation'].includes(category))) {
      if (selectedIndexInCurrent > -1) {
        newSelected = props.selected.filter(cat => cat !== category);
      } else {
        newSelected.push(category);
      }
    }
    newSelected = newSelected.map(cat => urlCategory(cat));
    return {
      selected: newSelected.join(','),
    };
  };

  return (
    <div>
      <FilterCheckboxGroup>
        {props.categories.map((category, index) => (
          <FilterCheckbox key={['SummaryCard', category, index].join('_')} label={category} value={category} handleChange={() => refreshLocation(getNewUrlParams(category), props.location)} selected={props.selected.includes(category) && !(props.location.query.mode === 'bond' && !['Parks', 'Housing', 'Transportation'].includes(category))} disabled={props.location.query.mode === 'bond' && !['Parks', 'Housing', 'Transportation'].includes(category)} />
        ))}
      </FilterCheckboxGroup>
      <div className="row">
        <div className="col-sm-6">
          <label style={{ minWidth: '400px', cursor: 'pointer', marginBottom: '0px' }}>
            <span style={{ fontSize: '26px', fontWeight: 'normal', marginRight: '10px' }}>Include only bond projects</span>
            <Toggle
              defaultChecked={props.location.query.mode === 'bond'}
              onChange={() => refreshLocation(toggleMode(), props.location)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

CIPFilter.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
};

CIPFilter.defaultProps = {
  selected: ['Transportation', 'Housing', 'Parks', 'Public Safety', 'Other'],
  categories: ['Transportation', 'Housing', 'Parks', 'Public Safety', 'Other'],
};

export default CIPFilter;
