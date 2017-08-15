import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { urlCategory, longCategory } from './cip_utilities';
import CapitalProjectsSummaryCard from './CapitalProjectsSummaryCard';


const CIPFilter = props => {
  const refreshLocation = (category) => {
    if (props.selected.length === 1 && props.selected[0] === category) { //can't deselect last one
      return;
    }
    let newSelected = props.selected.slice();
    const selectedIndexInCurrent = props.selected.indexOf(category);
    if (selectedIndexInCurrent > -1) {
      newSelected = props.selected.filter(cat => cat !== category);
    } else {
      newSelected.push(category);
    }
    newSelected = newSelected.map(cat => urlCategory(cat));
    browserHistory.push([props.location.pathname, '?view=', props.location.query.view || 'summary', "&selected=", newSelected.join(','), '&hideNavbar=', props.location.query.hideNavbar].join(''));
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <p style={{ marginTop: '10px' }}>Click or tap on the project categories below to select/deselect the projects to view.</p>
          <p>If you would like a map-based exploration, or wish to search by address, try the
            <a href="http://arcg.is/Sy5KC" target="_blank" style={{ marginLeft: '5px' }} title="Click to visit Project Map">
              <button className="btn btn-info btn-sm">
                Project Map
              </button>
            </a>
            .
          </p>
        </div>
      </div>
      <div className="row">
        {props.categories.map((category, index) => (
          <div className="col-sm-3 col-xs-6" key={['SummaryCard', category, 'index'].join('_')} style={{ cursor: 'pointer' }} onClick={() => (refreshLocation(category))}>
            <CapitalProjectsSummaryCard category={category} selected={props.selected.includes(category)} />
          </div>
        ))}
      </div>
    </div>
  );
};

CIPFilter.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
};

CIPFilter.defaultProps = {
  selected: ['Bond - Transportation Program'],
  categories: ['Bond - Transportation Program', 'Bond - Parks Program', 'Bond - Housing Program', 'General CIP'],
}

export default CIPFilter;
