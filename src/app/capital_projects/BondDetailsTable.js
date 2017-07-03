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
    accessor: 'name',
  },
  {
    Header: (<div>Zip<br />code</div>),
    accessor: 'zip',
    maxWidth: 120,
    headerClassName: 'hidden-sm hidden-xs',
    className: 'hidden-sm hidden-xs',
  },
  {
    Header: (<div>Current<br />phase</div>),
    accessor: 'phase',
    maxWidth: 225,
    Cell: row => (
      <span style={{ whiteSpace: 'normal' }}>
        <span style={{ marginRight: '5px' }}>
          <Icon path={IM_CIRCLE2} color={getStageNumber(row.value) >= 1 ? phaseColor(1) : '#ecf0f1'} />
        </span>
        <span style={{ marginRight: '5px' }}>
          <Icon path={IM_CIRCLE2}  color={getStageNumber(row.value) >= 2 ? phaseColor(2) : '#ecf0f1'} />
        </span>
        <span style={{ marginRight: '5px' }}>
          <Icon path={IM_CIRCLE2}  color={getStageNumber(row.value) >= 3 ? phaseColor(3) : '#ecf0f1'} />
        </span>
        <span style={{ marginRight: '5px' }}>
          <Icon path={IM_CIRCLE2} color={getStageNumber(row.value) >= 4 ? phaseColor(4) : '#ecf0f1'} style={{ marginRight: '5px' }} />
        </span>
        <span style={{ marginLeft: '5px', color: phaseColor(getStageNumber(row.value)) }}>
          {row.value}
        </span>
      </span>
    ),
  },
  {
    Header: (<div>Construction<br />start</div>),
    accessor: 'construction_start',
    maxWidth: 110,
    headerClassName: 'hidden-xs',
    className: 'hidden-xs',
  },
  {
    Header: (<div>Total<br />bond funding</div>),
    accessor: 'total',
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

const BondDetailsTable = props => (
  <div>
    {props.type === 'Transportation' &&
      <div className="row">
        <div className="col-sm-12">
          <div className="pull-right radioGroup">
            <RadioGroup name="tableRadios" selectedValue={props.subType} onChange={props.radioCallback}>
              <label>
                <Radio value="Road Resurfacing and Sidewalk Improvements" />Road & Sidewalk Improvements
              </label>
              <label>
                <Radio value="New Sidewalks and Greenways" />New Sidewalks & Greenways
              </label>
              <label>
                <Radio value="Pedestrian Safety" />Pedestrian Safety
              </label>
            </RadioGroup>
          </div>
        </div>
      </div>}
    <div className="row">
      <div className="col-sm-12">
        <div alt={['Table of', props.type, props.subType || '', 'bond project statuses'].join(' ')} style={{ marginTop: '10px' }}>
          <ReactTable
            data={props.data}
            columns={getColumns(props.type, props.subType)}
            pageSize={props.data.length}
            showPagination={false}
            getTrProps={(state, rowInfo, column) => {
              return {
                style: {
                  background: (Object.keys(state.expanded).includes(rowInfo.index.toString()) && state.expanded[rowInfo.index]) ? '#4077a5': 'none',
                  color: (Object.keys(state.expanded).includes(rowInfo.index.toString()) && state.expanded[rowInfo.index]) ? '#fff': '',
                  fontWeight: (Object.keys(state.expanded).includes(rowInfo.index.toString()) && state.expanded[rowInfo.index]) ? 'bold': 'normal',
                  fontSize: (Object.keys(state.expanded).includes(rowInfo.index.toString()) && state.expanded[rowInfo.index]) ? '1.2em': '1em',
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

BondDetailsTable.propTypes = {
  type: PropTypes.string,
  subType: PropTypes.string,
  data: PropTypes.array, // eslint-disable-line
  radioCallback: PropTypes.func,
};

export default BondDetailsTable;
