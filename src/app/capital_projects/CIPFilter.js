import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import Toggle from 'react-toggle';
import { urlCategory } from './cip_utilities';
import FilterCheckboxGroup from '../../shared/FilterCheckboxGroup';
import FilterCheckbox from '../../shared/FilterCheckbox';

const CIPFilter = (props) => {
  const refreshLocation = (category) => {
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
    browserHistory.replace([props.location.pathname, '?view=', props.location.query.view || 'summary', "&selected=", newSelected.join(','), '&hideNavbar=', props.location.query.hideNavbar, '&mode=', props.location.query.mode].join(''));
  };

  const toggleMode = () => {
    browserHistory.replace([props.location.pathname, '?view=', props.location.query.view || 'summary', '&selected=', props.location.query.selected, '&hideNavbar=', props.location.query.hideNavbar, '&mode=', props.location.query.mode === 'bond' ? 'all' : 'bond'].join(''));
  };

  return (
    <div>
      <FilterCheckboxGroup>
        {props.categories.map((category, index) => (
          <FilterCheckbox key={['SummaryCard', category, index].join('_')} label={category} value={category} handleChange={() => refreshLocation(category)} selected={props.selected.includes(category) && !(props.location.query.mode === 'bond' && !['Parks', 'Housing', 'Transportation'].includes(category))} disabled={props.location.query.mode === 'bond' && !['Parks', 'Housing', 'Transportation'].includes(category)} />
        ))}
      </FilterCheckboxGroup>
      <div className="row">
        <div className="col-sm-6">
          <label style={{ minWidth: '400px', cursor: 'pointer', marginBottom: '0px' }}>
            <span style={{ fontSize: '26px', fontWeight: 'normal', marginRight: '10px' }}>Include only bond projects</span>
            <Toggle
              defaultChecked={props.location.query.mode === 'bond'}
              onChange={toggleMode}
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
