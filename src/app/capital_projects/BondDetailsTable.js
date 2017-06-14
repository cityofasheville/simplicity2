import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { RadioGroup, Radio } from 'react-radio-group';

const dataColumns = [
  {
    header: 'Project',
    accessor: 'name',
    minWidth: 425,
  },
  {
    header: (<div>Zip<br />code</div>),
    accessor: 'zip',
    minWidth: 90,
  },
  {
    header: (<div>Current<br />phase</div>),
    accessor: 'phase',
    minWidth: 90,
  },
  {
    header: (<div>Construction<br />start</div>),
    accessor: 'construction_start',
    minWidth: 100,
  },
  {
    header: (<div>Total<br />bond funding</div>),
    accessor: 'total',
    minWidth: 110,
  },
];

const getColumns = (type, subType) => {
  if (type === 'Transportation') {
    return [{
      header: subType,
      columns: dataColumns,
    }];
  }
  return [{
    header: type,
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
            SubComponent={row => (
              <div style={{ paddingLeft: '34px' }}>
                {row.row.description}
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
