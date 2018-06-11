import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import EmailDownload from '../../shared/EmailDownload';
import Map from '../../shared/visualization/Map';
import { getBoundsFromPolygonData, combinePolygonsFromNeighborhoodList } from '../../utilities/mapUtilities';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { english } from './english';
import { spanish } from './spanish';

const GET_ADDRESSES_BY_NEIGHBORHOOD = gql`
  query addresses_by_neighborhood($nbrhd_ids: [String]) {
    addresses_by_neighborhood (nbrhd_ids: $nbrhd_ids) {
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
    neighborhoods (nbrhd_ids: $nbrhd_ids) {
      name
      polygon {
        outer {
          points {
            x
            y
          }
        }
        holes {
          points {
            x
            y
          }
        }
      }
    }
    language @client {
      lang
    }
  }
`;

const AddressesByNeighborhood = props => (
  <Query
    query={GET_ADDRESSES_BY_NEIGHBORHOOD}
    variables={{
      nbrhd_ids: [props.location.query.id.trim()],
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;
      // set language
      let content;
      switch (data.language.lang) {
        case 'Spanish':
          content = spanish;
          break;
        default:
          content = english;
      }
      const dataColumns = [
        {
          Header: content.address,
          accessor: 'Address',
          Cell: row => (
            <div>
              <div>
                {row.original.street_number} {row.original.street_prefix} {row.original.street_name} {row.original.unit}
              </div>
              <div>{row.original.city}, NC {row.original.zipcode}</div>
            </div>
          ),
          Filter: ({ filter, onChange }) => (
            <input
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : ''}
              placeholder={content.placeholder}
            />
          ),
          filterMethod: (filter, row) => {
            const joinedAddressInfo = `${row._original.street_number} ${row._original.street_prefix} ${row._original.street_number} ${row._original.street_name} ${row._original.unit} ${row._original.city} ,NC ${row._original.zipcode}`; // eslint-disable-line
            return row._original !== undefined ? joinedAddressInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true; // eslint-disable-line
          },
        },
        {
          Header: content.owner,
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
              placeholder={content.placeholder}
            />
          ),
          filterMethod: (filter, row) => {
            const joinedOwnerInfo = [row._original.owner_name, row._original.owner_address, row._original.owner_cityname, [',', row._original.owner_state].join(''), row._original.owner_zipcode].join(' '); // eslint-disable-line
            return row._original !== undefined ? // eslint-disable-line
              joinedOwnerInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
          },
        },
      ];

      const mapData = data.addresses_by_neighborhood.map(item =>
        (Object.assign(
          {},
          item,
          { popup: `<b>${content.address}</b><div>${item.street_number} ${item.street_prefix} ${item.street_name} ${item.unit || ''}</div><div>${item.city}, NC ${item.zipcode}</div><br /><b>${content.owner}</b><div>${item.owner_name}</div><div>${item.owner_address}</div><div>${item.owner_cityname}, ${item.owner_state} ${item.owner_zipcode}</div>` } // eslint-disable-line
        )));

      return (
        <div>
          <div className="row">
            <div className="col-sm-12">
              <EmailDownload
                downloadData={data.addresses_by_neighborhood}
                fileName={content.addresses_by_neighborhood_filename}
                lang={data.language.lang}
              />
            </div>
            <div id="listView" hidden={props.location.query.view === 'map'} className="col-sm-12">
              {data.addresses_by_neighborhood.length < 1 ?
                <div className="alert alert-info">No results found</div>
                :
                <div style={{ marginTop: '10px' }}>
                  <AccessibleReactTable
                    data={data.addresses_by_neighborhood}
                    arialLabel="Neighborhood Addresses"
                    columns={dataColumns}
                    showPagination={data.addresses_by_neighborhood.length > 20}
                    defaultPageSize={data.addresses_by_neighborhood.length <= 20
                      ? data.addresses_by_neighborhood.length : 20}
                    getTdProps={() => (
                      {
                        style: {
                          whiteSpace: 'normal',
                        },
                      }
                    )}
                    filterable
                  />
                </div>
              }
            </div>

            <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
              {data.addresses_by_neighborhood.length === 0 || props.location.query.view !== 'map' ?
                <div className="alert alert-info">No results found</div>
                :
                <Map
                  data={mapData}
                  drawPolygon
                  polygonData={combinePolygonsFromNeighborhoodList([data.neighborhoods[0]])}
                  bounds={getBoundsFromPolygonData([data.neighborhoods[0].polygon])}
                />
              }
            </div>
          </div>
        </div>
      );
    }}
  </Query>
);

AddressesByNeighborhood.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

AddressesByNeighborhood.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

export default AddressesByNeighborhood;
