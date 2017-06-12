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

const BondDetailsTable = (props) => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h4>{props.title} bond projects & statuses</h4>
        <div alt={['Table of', props.title, 'bond project statuses'].join(' ')}>
          <ReactTable
            data={props.data}
            columns={dataColumns}
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

export default BondDetailsTable;
