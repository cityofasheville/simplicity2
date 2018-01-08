import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ReactTable from 'react-table';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Map from '../../shared/visualization/Map';
import { getBoundsFromStreetData, convertStreetLinesToLatLngArrays, formatMaintenanceData } from '../../utilities/mapUtilities';

const dataColumns = [
  {
    Header: 'Centerline ID',
    accessor: 'centerline_id',
    Cell: row => (
      <span>{parseInt(row.original.centerline_id, 10)}</span>
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
    Header: 'Maintenance Entities',
    accessor: 'maintenance_entities',
    Cell: row => (
      <span>{row.original.maintenance_entities.map((item, index) => <div key={index}>{item}</div>)}</span>
    ),
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
    filterMethod: (filter, row) => {
      const joinedInfo = row._original.maintenance_entities.join('');
      return row._original !== undefined ? joinedInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
    },
  },
];

const MaintenanceByStreet = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  return (
    <div className="row">
      <div className="col-sm-12">
        <div id="listView" hidden={props.location.query.view === 'map'} alt={['Table of addresses'].join(' ')} style={{ marginTop: '10px' }}>
          <ReactTable
            data={props.data.streets}
            columns={dataColumns}
            showPagination={props.data.streets.length > 20}
            defaultPageSize={props.data.streets.length <= 20 ? props.data.streets.length : 20}
            filterable
            defaultFilterMethod={(filter, row) => {
              const id = filter.pivotId || filter.id;
              return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
            }}
            getTdProps={(state, rowInfo) => {
              return {
                style: {
                  whiteSpace: 'normal',
                },
              };
            }}
          />
        </div>

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
          {props.data.streets.length === 0 || props.location.query.view !== 'map' ?
            <div className="alert alert-info">No results found</div>
            :
            <Map maintenanceData={formatMaintenanceData(props.data.streets)} drawMaintenance bounds={getBoundsFromStreetData(props.data.streets)} />
          }
        </div>
      </div>
    </div>
  );
};

const getMaintenanceQuery = gql`
  query getMaintenanceQuery($centerline_ids: [Float]) {
    streets (centerline_ids: $centerline_ids) {
      centerline_id
        left_zipcode
        right_zipcode
        maintenance_entities
        line {
          x
          y
        }
    }    
  }
`;

const MaintenanceByStreetGQL = graphql(getMaintenanceQuery, {
  options: ownProps => ({
    variables: {
      centerline_ids: ownProps.location.query.id.split(','),
    },
  }),
})(MaintenanceByStreet);

export default MaintenanceByStreetGQL;
