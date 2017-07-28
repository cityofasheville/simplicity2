import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { RadioGroup, Radio } from 'react-radio-group';
import ProjectDetails from './ProjectDetails';
import Icon from '../../shared/Icon';
import { IM_CIRCLE2 } from '../../shared/iconConstants.js';

const getStageNumber = (stage) => {
  switch (stage) {
    case 'Planning':
      return 1;
    case 'Design':
      return 2;
    case 'Construction':
      return 3;
    case 'Completed':
      return 4;
    case 'Ongoing':
      return 5;
    default:
      return 0;
  }
};

const phaseColor = (phaseNumber) => {
  switch (phaseNumber) {
    case 1:
      return '#f844ff';
    case 2:
      return '#44cdff';
    case 3:
      return '#FF5722';
    default:
      return '#57d500';
  }
};

const dataColumns = [
  {
    Header: 'Project',
    accessor: 'Display Name',
  },
  {
    Header: (<div>Zip<br />code</div>),
    accessor: 'Zip Code',
    maxWidth: 120,
    headerClassName: 'hidden-sm hidden-xs',
    className: 'hidden-sm hidden-xs',
  },
  {
    Header: (<div>Current<br />phase</div>),
    id: 'Status',
    accessor: (project) => ( project.Status.indexOf('Status: ') > -1 ? project.Status.split(': ')[1] : project.Status),
    maxWidth: 225,
    Cell: row => (
      <span style={{ whiteSpace: 'normal' }}>
        <span style={{ marginRight: row.value !== 'Ongoing' ? '5px' : '12px' }}>
          <Icon path={IM_CIRCLE2} color={getStageNumber(row.value) >= 1 ? phaseColor(1) : '#ecf0f1'} />
        </span>
        <span style={{ marginRight: row.value !== 'Ongoing' ? '5px' : '12px' }}>
          <Icon path={IM_CIRCLE2}  color={getStageNumber(row.value) >= 2 ? phaseColor(2) : '#ecf0f1'} />
        </span>
        <span style={{ marginRight: row.value !== 'Ongoing' ? '5px' : '12px' }}>
          <Icon path={IM_CIRCLE2} color={row.value === 'Ongoing' ? 
            '#FFC107' : getStageNumber(row.value) >= 3 ? phaseColor(3) : '#ecf0f1'} />
        </span>
        {row.value !== 'Ongoing' &&
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_CIRCLE2} color={getStageNumber(row.value) >= 4 ? phaseColor(4) : '#ecf0f1'} style={{ marginRight: '5px' }} />
          </span>
        }
        <span style={{ marginLeft: '5px', color: row.value === 'Ongoing' ? '#FFC107' : phaseColor(getStageNumber(row.value)) }}>
          {row.value}
        </span>
      </span>
    ),
  },
  // {
  //   Header: (<div>Construction<br />start</div>),
  //   accessor: 'Target Construction Start',
  //   maxWidth: 110,
  //   headerClassName: 'hidden-xs',
  //   className: 'hidden-xs',
  // },
  {
    Header: (<div>Approved<br />project budget</div>),
    accessor: 'Total Project Funding (Budget Document)',
    maxWidth: 150,
    headerClassName: 'hidden-sm hidden-xs',
    className: 'hidden-sm hidden-xs',
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
            defaultFilterMethod={(filter, row, column) => {
              const id = filter.pivotId || filter.id
              return row[id] !== undefined ? String(row[id]).toLowerCase().startsWith(filter.value.toLowerCase()) : true
            }}
            getTrProps={(state, rowInfo) => {
              return {
                style: {
                  background: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#4077a5': 'none',
                  color: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#fff': '',
                  fontWeight: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? 'bold': 'normal',
                  fontSize: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '1.2em': '1em',
                }
              }
            }}
            SubComponent={row => (
              <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingBottom: '15px', backgroundColor: '#f6fcff', borderRadius: '3px' }}>
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
  radioCallback: PropTypes.func,
};

export default ProjectsTable;
