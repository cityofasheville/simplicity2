/**
*
* DateRangeSelector
*
*/

import React from 'react';
import moment from 'moment';

import styles from './dateRangeSelectorStyles.css';

const dateOptions = {
  'yesterday': {
    id: 'dateRangeSelector1',
    dateRange: {
      start: moment().subtract(1, 'days').toDate(),
      end: moment().toDate(),
    },
    label: 'YESTERDAY'
  },
  'last-week': {
    id: 'dateRangeSelector2',
    dateRange: {
      start: moment().subtract(7, 'days').toDate(),
      end: moment().toDate(),
    },
    label: 'LAST WEEK'},
  'last-30-days': {
    id: 'dateRangeSelector3',
    dateRange: {
      start: moment().subtract(30, 'days').toDate(),
      end: moment().toDate(),
    },
    label: 'LAST 30 DAYS'},
  'last-month': {
    id: 'dateRangeSelector4',
    dateRange: {
      start: moment().subtract(1, 'months').toDate(),
      end: moment().toDate(),
    },
    label: 'LAST MONTH'},
  'last-6-months': {
    id: 'dateRangeSelector5',
    dateRange: {
      start: moment().subtract(6, 'months').toDate(),
      end: moment().toDate(),
    },
    label: 'LAST 6 MONTHS'},
    'last-year': {
      id: 'dateRangeSelector6',
      dateRange: {
        start: moment().subtract(1, 'years').toDate(),
        end: moment().toDate(),
      },
      label: 'LAST YEAR'},
};

const renderOption = (option) => {
  if(dateOptions[option] === undefined){
    return null
  }
  return(
    <option key = {dateOptions[option].id} value={option}>{dateOptions[option].label}</option>
  )
}


const DateRangeSelector = (props) =>  (
  <form className={['col-xs-12', styles.dateRangeSelector].join(' ')} >
    <label htmlFor="dateRangeSelector">Select a date range:</label>
    <select
      id="dateRangeSelector"
      className="form-control"
      onChange={(e)=>{props.onChange(dateOptions[e.target.value].dateRange)}}>
      {
        props.options.map((option) => (renderOption(option)))
      }
    </select>
  </form>
);

DateRangeSelector.propTypes= {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default DateRangeSelector;
