import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Map from '../../shared/visualization/Map';
import EmailDownload from '../../shared/EmailDownload';
import { getBoundsFromStreetData, convertStreetLinesToLatLngArrays } from '../../utilities/mapUtilities';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';

const dataColumns = [
  {
    Header: 'Address',
    accessor: 'Address',
    Cell: row => (
      <div>
        <div>{row.original.street_number} {row.original.street_prefix} {row.original.street_name} {row.original.unit}</div>
        <div>{row.original.city}, NC {row.original.zipcode}</div>
      </div>
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
      const joinedAddressInfo = [row._original.street_number, row._original.street_prefix, row._original.street_number, row._original.street_name, row._original.unit, row._original.city, ',NC', row._original.zipcode].join(' ');
      return row._original !== undefined ? joinedAddressInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
    },
  },
  {
    Header: 'Owner',
    accessor: 'Owner',
    Cell: row => (
      <div>
        <div>{row.original.owner_name}</div>
        <div>{row.original.owner_address}</div>
        <div>{row.original.owner_cityname}, {row.original.owner_state} {row.original.owner_zipcode}</div>
      </div>
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
      const joinedOwnerInfo = [row._original.owner_name, row._original.owner_address, row._original.owner_cityname, [',', row._original.owner_state].join(''), row._original.owner_zipcode].join(' ');
      return row._original !== undefined ? joinedOwnerInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
    },
  },
];

const AddressesByStreet = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  const mapData = props.data.addresses_by_street.map(item => (Object.assign({}, item, { popup: `<b>Address</b><div>${item.street_number} ${item.street_prefix} ${item.street_name} ${item.unit || ''}</div><div>${item.city}, NC ${item.zipcode}</div><br /><b>Owner</b><div>${item.owner_name}</div><div>${item.owner_address}</div><div>${item.owner_cityname}, ${item.owner_state} ${item.owner_zipcode}</div>` })
  ));

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <EmailDownload downloadData={props.data.addresses_by_street} fileName="addresses_by_street.csv" />
        </div>
        <div id="listView" hidden={props.location.query.view === 'map'} className="col-sm-12">
          {props.data.addresses_by_street.length < 1 ?
            <div className="alert alert-info">No results found</div>
          :
            <div alt={['Table of addresses'].join(' ')} style={{ marginTop: '10px' }}>
              <ReactTable
                data={props.data.addresses_by_street}
                columns={dataColumns}
                showPagination={props.data.addresses_by_street.length > 20}
                defaultPageSize={props.data.addresses_by_street.length <= 20 ? props.data.addresses_by_street.length : 20}
                getTdProps={() => {
                  return {
                    style: {
                      whiteSpace: 'normal',
                    },
                  };
                }}
                filterable
              />
            </div>
          }
        </div>

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
          {props.data.addresses_by_street.length === 0 || props.location.query.view !== 'map' ?
            <div className="alert alert-info">No results found</div>
            :
            <Map data={mapData} bounds={getBoundsFromStreetData(props.data.streets)} drawStreet streetData={convertStreetLinesToLatLngArrays(props.data.streets)} />
          }
        </div>
      </div>
    </div>
  );
};

AddressesByStreet.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

AddressesByStreet.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

const getAddressesAndStreetInfoQuery = gql`
  query getAddressesAndStreetInfoQuery($centerline_ids: [Float]) {
    addresses_by_street (centerline_ids: $centerline_ids) {
      civic_address_id
      x
      y
      street_name
      street_prefix
      street_number
      unit
      city
      zipcode
      is_in_city
      owner_name
      owner_address
      owner_cityname
      owner_state
      owner_zipcode
    }
    streets (centerline_ids: $centerline_ids) {
      centerline_id
        left_zipcode
        right_zipcode
        line {
          x
          y
        }
    }
  }
`;

const AddressesByStreetGQL = graphql(getAddressesAndStreetInfoQuery, {
  options: ownProps => ({
    variables: {
      centerline_ids: ownProps.location.query.id.split(','),
    },
  }),
})(AddressesByStreet);

export default AddressesByStreetGQL;
