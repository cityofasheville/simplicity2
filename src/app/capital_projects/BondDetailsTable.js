import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { RadioGroup, Radio } from 'react-radio-group';

const dataColumns = [
  {
    header: 'Project',
    accessor: 'name',
    minWidth: 300,
  },
  {
    header: 'Zip code',
    accessor: 'zip',
    minWidth: 110,
  },
  {
    header: 'Current phase',
    accessor: 'phase',
    minWidth: 122,
  },
  {
    header: 'Construction start',
    accessor: 'construction_start',
    minWidth: 130,
  },
  {
    header: 'Total bond funding',
    accessor: 'total',
    minWidth: 130,
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

const filterComponent = () => (
  <input type="text"></input>
);

const BondDetailsTable = props => (
  <div>
    {props.type === 'Transportation' &&
      <div className="pull-right">
        <RadioGroup name="tableRadios" selectedValue={props.subType} onChange={props.radioCallback}>
          <Radio value="Road Resurfacing and Sidewalk Improvements" />Road & Sidewalk Improvements
          <Radio value="New Sidewalks and Greenways" />New Sidewalks & Greenways
          <Radio value="Pedestrian Safety" />Pedestrian Safety
        </RadioGroup>
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
