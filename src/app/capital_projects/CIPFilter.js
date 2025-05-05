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
import { browserHistory } from 'react-router';


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
    let baseUrl = location.pathname;
    const params = new URLSearchParams(url.split('?')[1]);
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

    const updatedURL = `${baseUrl}?${params.toString()}`;
    browserHistory.replace(updatedURL)
}

  const handleClick = (checkedValues) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    let newValues = checkedValues;
    if (checkedValues.includes('All') && !visibleSelection.includes('All')) {
      newValues = [...props.filter_variable];
    } else if (!checkedValues.includes('All') && visibleSelection.includes('All')) {
      newValues = [];
    } 
    updateURL(location.href, newValues.filter(e => e !== 'All'))
  };
  
  const getVisibleSelection = () => {
    let { selected } = props;
  
    if (selected.length === props.filter_variable.length) {
      return [...selected, 'All'];
    }
  
    return selected;
  };
  
  const visibleSelection = getVisibleSelection();

  return (
    <div>
      <div>
        <CheckboxGroup
          checkedValues={visibleSelection}
          onChange={handleClick}
          className="checkboxGroup"
        >
          <FilterCheckbox
            label="All"
            value="All"
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
