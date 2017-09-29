import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Icon from '../../shared/Icon';
import { IM_SHIELD3, IM_MAP5 } from '../../shared/iconConstants';

const getIcon = (type, isExpanded) => {
  switch (type) {
    case 'Aggravated Assault':
      return <Icon path={IM_SHIELD3} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Larceny':
      return <Icon path={IM_SHIELD3} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Larceny of Motor Vehicle':
      return <Icon path={IM_SHIELD3} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Robbery':
      return <Icon path={IM_SHIELD3} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Vandalism':
      return <Icon path={IM_SHIELD3} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" height="25px" transform="translate(0,4)" version="1.1" viewBox="0 0 16 16" width="25px"><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill={isExpanded ? '#fff' : '#4077a5'} id="Group" transform="translate(-528.000000, -576.000000)"><path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" id="Oval 12 copy" /></g></g></svg>;
  }
};

const dataColumns = [
  {
    Header: 'Type',
    accessor: 'crime',
    width: 225,
    Cell: row => (
      <span>
        <span title={row.original.crime}>{getIcon(row.value, row.isExpanded)}</span>
        <span style={{ marginLeft: '5px' }}>{row.value}</span>
      </span>
    ),
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
  {
    Header: 'Date',
    accessor: 'date',
    width: 100,
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
  {
    Header: 'Location',
    accessor: 'location',
    //headerClassName: 'hidden-sm hidden-xs',
    //className: 'hidden-sm hidden-xs',
    Cell: row => (
      <span>
        <span> <a title="Click to crime in map" target="_blank" href="http://www.google.com"><Icon path={IM_MAP5} size={23} /></a></span>
        <span style={{ marginLeft: '5px' }}>{row.value}</span>
      </span>
    ),
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
  {
    Header: 'Case #',
    accessor: 'caseNumber',
    width: 95,
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
  {
    Header: 'Law Beat',
    accessor: 'lawBeat',
    width: 85,
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },  
];

const CrimeTable = props => (
  <div>
    <div className="col-sm-12">
      <div alt={['Table of crimes'].join(' ')} style={{ marginTop: '10px' }}>
        <ReactTable
          data={props.data}
          columns={dataColumns}
          showPagination={props.data.length > 20}
          defaultPageSize={props.data.length <= 20 ? props.data.length : 20}
          filterable
          defaultFilterMethod={(filter, row) => {
            const id = filter.pivotId || filter.id;
            return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
          }}
        />
      </div>
    </div>
  </div>
);

CrimeTable.propTypes = {
  data: PropTypes.array, // eslint-disable-line
};

export default CrimeTable;
