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
import Icon from '../../shared/Icon';
import { IM_INFO } from '../../shared/iconConstants';
import { useEffect, useState } from 'react';

const CIPFilter = (props) => {
  let [newValues, updateNewValues] = useState([])

  // set language
  let content;
  switch (props.language.language) {
    case 'Spanish':
      content = spanish;
      break;
    default:
      content = english;
  }

  function updateURL(url, values) {
    const params = new URLSearchParams(url.split('?')[1]);
    const baseUrl = url.split('?')[0];
    let serializedArray;

    if (values.length > 1) {
      serializedArray = values.join(',');
    } else {
      serializedArray = values
    }

    if (props.variableString == 'categories') {
      params.set('categories', serializedArray);
    } else if (props.variableString == 'types') {
      params.set('types', serializedArray);
    }

    const updatedUrl = `${baseUrl}?${params.toString()}`;
    window.history.pushState({}, '', updatedUrl);
    props.setUpdatedURL(updatedUrl)
}

  const handleClick = (checkedValues) => {
    let newValues = checkedValues;
    if (checkedValues.includes('All') && !visibleSelection.includes('All')) {
      newValues = [...props.filter_variable];
    } else if (!checkedValues.includes('All') && visibleSelection.includes('All')) {
      newValues = [];
    } 
    updateURL(location.href, newValues.filter(e => e !== 'All'))
    getVisibleSelection()
  };
  
  const getVisibleSelection = () => {
      let { selected } = props;

    if (selected.length == props.filter_variable.length) {
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
            (props.filter_variable.length) &&
            realSelection.length > 0 ? ['All'] : []}
          onChange={handleClick}
          className="checkboxGroup"
        >
          <FilterCheckbox
            label="All"
            value="All"
            selected={visibleSelection.includes('All')}
          />
          {props.filter_variable.filter(e => e !== 'All').map((type, index) => (
            <FilterCheckbox
              key={['SummaryCard', type, index].join('_')}
              label={type}
              value={type}
              selected={visibleSelection.includes(type)}
            />
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
};

CIPFilter.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
};

export default withLanguage(CIPFilter);
