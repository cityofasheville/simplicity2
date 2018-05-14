import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import { CheckboxGroup } from 'accessible-react-checkbox-group';
import { urlCategory } from './cip_utilities';
import FilterCheckbox from '../../shared/FilterCheckbox';
import { refreshLocation } from '../../utilities/generalUtilities';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';

const CIPFilter = (props) => {
  const toggleMode = () => (
    {
      mode: props.location.query.mode === 'bond' ? 'all' : 'bond',
    }
  );

  const getNewUrlParams = (selected) => {
    const newSelected = selected.map(cat => urlCategory(cat));
    return {
      selected: newSelected.join(','),
    };
  };

  const handleClick = (checkedValues) => {
    refreshLocation(getNewUrlParams(checkedValues), props.location);
  };

  return (
    <div>
      <div>
        <CheckboxGroup checkedValues={props.selected} onChange={handleClick}>
          {props.categories.map((category, index) => (
            <FilterCheckbox
              key={['SummaryCard', category, index].join('_')}
              label={category}
              value={category}
              selected={props.selected.includes(category) && !(props.location.query.mode === 'bond' && !['Parks', 'Housing', 'Transportation'].includes(category))}
              disabled={props.location.query.mode === 'bond' && !['Parks', 'Housing', 'Transportation'].includes(category)}
            />
          ))}
        </CheckboxGroup>
        <div className="col-sm-12">
          <Button size="sm" style={{ marginRight: '2px' }} onClick={() => handleClick(props.categories)}>Select All</Button>
          <Button size="sm" onClick={() => handleClick([])}>Deselect All</Button>
        </div>
        <div className="toggle toggle--table">
          <div>
            <label>
              <span>Include only bond projects</span>
              <Toggle
                defaultChecked={props.location.query.mode === 'bond'}
                onChange={() => refreshLocation(toggleMode(), props.location)}
              />
            </label>
          </div>
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
  selected: [],
  categories: ['Transportation', 'Housing', 'Parks', 'Public Safety', 'Other'],
};

export default CIPFilter;
