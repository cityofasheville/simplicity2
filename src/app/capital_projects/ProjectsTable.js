import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import ProjectDetails from './ProjectDetails';
import { mapProjectToCategory } from './cip_utilities';
import Icon from '../../shared/Icon';
import { IM_SHIELD3, IM_TREE, IM_HOME2, IM_BUS, LI_BOLD } from '../../shared/iconConstants';

const getIcon = (category, isExpanded) => {
  switch (category) {
    case 'Bond - Parks Program':
      return <Icon path={IM_TREE} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'CIP - Parks & Recreation':
      return <Icon path={IM_TREE} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Bond - Transportation Program':
      return <Icon path={IM_BUS} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'CIP - Transportation & Infrastructure':
      return <Icon path={IM_BUS} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Bond - Housing Program':
      return <Icon path={IM_HOME2} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'CIP - Affordable Housing':
      return <Icon path={IM_HOME2} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'CIP - Public Safety':
      return <Icon path={IM_SHIELD3} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" height="25px" transform="translate(0,4)" version="1.1" viewBox="0 0 16 16" width="25px"><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill={isExpanded ? '#fff' : '#4077a5'} id="Group" transform="translate(-528.000000, -576.000000)"><path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" id="Oval 12 copy" /></g></g></svg>;
  }
};

const dataColumns = [
  {
    Header: 'Project',
    accessor: 'display_name',
    Cell: row => (
      <span>
        <span title={mapProjectToCategory(row.original)}>{getIcon(row.original.category, row.isExpanded)}</span>
        {row.original.category.indexOf('Bond') > -1 &&
          <span title={'Bond project'} style={{ marginLeft: '3px' }}><Icon path={LI_BOLD} size={16} color={row.isExpanded ? '#fff' : '#4077a5'} viewBox="0 0 24 24" /></span>
        }
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
    Header: (<div>Zip<br />code</div>),
    accessor: 'zip_code',
    maxWidth: 120,
    headerClassName: 'hidden-sm hidden-xs',
    className: 'hidden-sm hidden-xs',
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
    Header: (<div>Current<br />phase</div>),
    accessor: 'status',
    Cell: row => (
      <span>
        {!row.original.show_pm_fields || row.original.status === null ?
          '--'
          :
          row.original.status.indexOf('Status: ') > -1 ?
          row.original.status.split(': ')[1]
          :
          row.original.status
        }
      </span>
    ),
    maxWidth: 120,
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
    Header: (<div>Current<br />project budget</div>),
    accessor: 'total_project_funding_budget_document',
    maxWidth: 120,
    headerClassName: 'hidden-xs',
    className: 'hidden-xs',
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
    Header: (<div>Spent</div>),
    id: 'spent',
    accessor: project => (!project.show_pm_fields ? '--' : ['$', parseInt(project.total_spent, 10).toLocaleString()].join('')),
    maxWidth: 120,
    headerClassName: 'hidden-xs',
    className: 'hidden-xs',
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

const getColumns = (type, subType) => {
  if (type === 'Transportation') {
    return [{
      Header: subType,
      columns: dataColumns,
    }];
  }
  return [{
    Header: type,
    columns: dataColumns,
  }];
};

const ProjectsTable = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <div alt={['Table of', props.type, props.subType || '', 'bond project statuses'].join(' ')} style={{ marginTop: '10px' }}>
          <ReactTable
            data={props.data}
            columns={getColumns(props.type, props.subType)}
            showPagination
            defaultPageSize={20}
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
                  background: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#4077a5' : 'none',
                  color: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#fff' : '',
                  fontWeight: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? 'bold' : 'normal',
                  fontSize: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '1.2em' : '1em',
                },
              };
            }}
            SubComponent={row => (
              <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingBottom: '15px', backgroundColor: '#f6fcff', borderRadius: '0px', border: '2px solid #4077a5' }}>
                <ProjectDetails {...row.original} hideTitle />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  </div>
);

ProjectsTable.propTypes = {
  type: PropTypes.string,
  subType: PropTypes.string,
  data: PropTypes.array, // eslint-disable-line
};

export default ProjectsTable;
