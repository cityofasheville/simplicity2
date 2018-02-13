import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTable from 'react-table';
import DevelopmentDetail from './DevelopmentDetail';
import Icon from '../../shared/Icon';
import { IM_HOME2, IM_MAP5, IM_OFFICE, IM_DIRECTION, IM_LIBRARY2, IM_FIRE, IM_USERS4, IM_COOK, IM_CITY, LI_WALKING, IM_MUG } from '../../shared/iconConstants';

const getIcon = (type, isExpanded) => {
  switch (type) {
    case 'Commercial':
      return <Icon path={IM_OFFICE} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Residential':
      return <Icon path={IM_HOME2} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Sign':
      return <Icon path={IM_DIRECTION} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Historical':
      return <Icon path={IM_LIBRARY2} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Fire':
      return <Icon path={IM_FIRE} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Event-Temporary Use':
      return <Icon path={IM_USERS4} size={25} viewBox="0 0 24 24" color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Outdoor Vendor':
      return <Icon path={IM_COOK} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Development':
      return <Icon path={IM_CITY} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Right of Way':
      return <Icon path={LI_WALKING} size={25} viewBox="0 0 24 24" color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Over The Counter':
      return <Icon path={IM_MUG} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" height="25px" transform="translate(0,4)" version="1.1" viewBox="0 0 16 16" width="25px"><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill={isExpanded ? '#fff' : '#4077a5'} id="Group" transform="translate(-528.000000, -576.000000)"><path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" id="Oval 12 copy" /></g></g></svg>;
  }
};


const DevelopmentTable = (props) => {
  const urlString = [props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&within=', document.getElementById('extent').value, '&during=', document.getElementById('time').value, '&hideNavbar=', props.location.query.hideNavbar, '&search=', props.location.query.search, '&view=map', '&x=', props.location.query.x, '&y=', props.location.query.y].join('');

  const dataColumns = [
    {
      Header: 'Name',
      accessor: 'applicant_name',
      minWidth: 250,
      Cell: row => (
        <span>
          <span> <a title="Click to permit in map" href={[urlString, '&zoomToPoint=', [row.original.y, row.original.x].join(',')].join('')} style={{ color: row.isExpanded ? 'white' : '#4077a5' }}><Icon path={IM_MAP5} size={23} /></a></span>
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
      Header: 'Type',
      accessor: 'permit_type',
      minWidth: 150,
      Cell: row => (
        <span>
          <span title={row.original.permit_type}>{getIcon(row.value, row.isExpanded)}</span>
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
      Header: 'Contractor',
      accessor: 'contractor_name',
      minWidth: 150,
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
      Header: 'Applied Date',
      id: 'applied_date',
      accessor: permit => (<span>{moment.utc(permit.applied_date).format('M/DD/YYYY')}</span>),
      width: 110,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={event => onChange(event.target.value)}
          style={{ width: '100%' }}
          value={filter ? filter.value : ''}
          placeholder="Search..."
        />
      ),
      filterMethod: (filter, row) => {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined ? String(row[id].props.children).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
      },
    },
    {
      Header: 'Permit #',
      accessor: 'permit_number',
      width: 115,
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

  return (
    <div>
      <div className="col-sm-12">
        {props.data.length < 1 ?
          <div className="alert alert-info">No results found</div>
        :
          <div alt={['Table of development'].join(' ')} style={{ marginTop: '10px' }}>
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
              getTdProps={(state, rowInfo) => {
                return {
                  onClick: (e, handleOriginal) => {
                    document.getElementsByClassName('rt-expandable')[rowInfo.viewIndex].click();
                    if (handleOriginal) {
                      handleOriginal();
                    }
                  },
                  style: {
                    whiteSpace: 'normal',
                  },
                };
              }}
              getTrProps={(state, rowInfo) => {
                return {
                  style: {
                    cursor: 'pointer',
                    background: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#4077a5': 'none',
                    color: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#fff': '',
                    fontWeight: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? 'bold': 'normal',
                    fontSize: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '1.2em': '1em',
                  },
                };
              }}
              SubComponent={row => (
                <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingBottom: '15px', backgroundColor: '#f6fcff', borderRadius: '0px', border: '2px solid #4077a5' }}>
                  <DevelopmentDetail data={row.original} standalone={false} />
                </div>
              )}
            />
          </div>
        }
      </div>
    </div>
  );
};


DevelopmentTable.propTypes = {
  data: PropTypes.array, // eslint-disable-line
};

export default DevelopmentTable;
