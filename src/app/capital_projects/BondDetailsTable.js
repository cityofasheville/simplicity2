import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

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

const BondDetailsTable = props => (
  <div>
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
};

export default BondDetailsTable;
