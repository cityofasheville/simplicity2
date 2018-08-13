import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import { CheckboxGroup } from 'accessible-react-checkbox-group';
import { urlCategory } from './cip_utilities';
import FilterCheckbox from '../../shared/FilterCheckbox';
import { refreshLocation } from '../../utilities/generalUtilities';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const CIPFilter = (props) => {
  // set language
  let content;
  switch (props.language.language) {
    case 'Spanish':
      content = spanish;
      break;
    default:
      content = english;
  }

  const toggleMode = () => (
    {
      mode: props.location.query.mode === 'bond' ? 'all' : 'bond',
      selected: props.selected.map(cat => urlCategory(cat)),
    }
  );

  const getNewUrlParams = (selected) => {
    const newSelected = selected.map(cat => urlCategory(cat));
    return {
      selected: newSelected.join(','),
    };
  };

  const handleClick = (checkedValues) => {
    let newValues = checkedValues;
    if (checkedValues.includes('All') && !visibleSelection.includes('All')) {
      newValues = [...props.categories];
    } else if (!checkedValues.includes('All') && visibleSelection.includes('All')) {
      newValues = [];
    }
    refreshLocation(getNewUrlParams(newValues.filter(e => e !== 'All')), props.location);
  };

  const bondOnly = props.location.query.mode === 'bond';

  const getVisibleSelection = () => {
    let { selected } = props;
    if (bondOnly) {
      selected = selected.filter(e => props.bond_categories.indexOf(e) !== -1);
    }
    if (selected.length > 0) {
      selected.push('All');
    }
    return selected;
  };

  const visibleSelection = getVisibleSelection();
  const realSelection = visibleSelection.filter(e => e !== 'All');

  return (
    <div>
      <div>
        <CheckboxGroup
          checkedValues={visibleSelection}
          indeterminateValues={realSelection.length <
            (bondOnly ? props.categories.length - 1 : props.categories.length) &&
            realSelection.length > 0 ? ['All'] : []}
          onChange={handleClick}
          className="checkboxGroup"
        >
          <FilterCheckbox
            label="All"
            value="All"
            // selected={visibleSelection.includes('All')}
          />
          {props.categories.filter(e => e !== 'All').map((category, index) => (
            <FilterCheckbox
              key={['SummaryCard', category, index].join('_')}
              label={category}
              value={category}
              // selected={visibleSelection.includes(category)}
              disabled={props.location.query.mode === 'bond' &&
                !props.bond_categories.includes(category)}
            />
          ))}
        </CheckboxGroup>
        <div className="toggle toggle--table">
          <div>
            <label>
              <span>{content.include_only_bond_projects}</span>
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

export default withLanguage(CIPFilter);
