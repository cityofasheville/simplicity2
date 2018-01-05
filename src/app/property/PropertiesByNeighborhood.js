import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Map from '../../shared/visualization/Map';
import Property from './Property';
import { getBoundsFromPolygonData, combinePolygonsFromPropertyList } from '../../utilities/mapUtilities';
import LoadingAnimation from '../../shared/LoadingAnimation';

const dataColumns = [
  {
    Header: 'Pin #',
    accessor: 'pinnum',
    width: 175,
    Cell: row => (
      <span>{row.original.pinnum}</span>
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
      const joinedInfo = row._original.pinnum;
      return row._original !== undefined ? joinedInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
    },
  },
  {
    Header: 'Civic Address ID',
    accessor: 'property_civic_address_id',
    width: 150,
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
    Header: 'Address',
    accessor: 'Address',
    Cell: row => (
      <span>{row.original.property_address}, {row.original.property_zipcode}</span>
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
      const joinedInfo = [row._original.address, row._original.zipcode].join(', ');
      return row._original !== undefined ? joinedInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
    },
  },
];

const PropertiesByNeighborhood = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }

  return (
    <div>
      <div className="row">
        <div id="listView" hidden={props.location.query.view === 'map'}>
          {props.data.properties_by_neighborhood.length < 1 ?
            <div className="alert alert-info">No results found</div>
          :
            <div alt={['Table of addresses'].join(' ')} style={{ marginTop: '10px' }}>
              <ReactTable
                data={props.data.properties_by_neighborhood}
                columns={dataColumns}
                showPagination={props.data.properties_by_neighborhood.length > 20}
                defaultPageSize={props.data.properties_by_neighborhood.length <= 20 ? props.data.properties_by_neighborhood.length : 20}
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
                      background: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#4077a5': 'none',
                      color: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#fff': '',
                      fontWeight: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? 'bold': 'normal',
                      fontSize: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '1.2em': '1em',
                    },
                  };
                }}
                SubComponent={row => (
                  <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingBottom: '15px', backgroundColor: '#f6fcff', borderRadius: '0px', border: '2px solid #4077a5' }}>
                    <Property data={row.original} hideHeader={true} inTable />
                  </div>
                )}
              />
            </div>
          }
        </div>

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view !== 'map'}>
          {props.data.properties_by_neighborhood.length === 0 || props.location.query.view !== 'map' ?
            <div className="alert alert-info">No results found</div>
            :
            <Map bounds={getBoundsFromPolygonData([props.data.neighborhoods[0].polygon])} drawPolygon polygonData={combinePolygonsFromPropertyList(props.data.properties_by_neighborhood)} />
          }
        </div>
      </div>
    </div>
  );
};

PropertiesByNeighborhood.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

PropertiesByNeighborhood.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

const getPropertiesByNeighborhoodQuery = gql`
  query getPropertiesByNeighborhoodQuery($nbrhd_ids: [String]) {
    properties_by_neighborhood (nbrhd_ids: $nbrhd_ids) {
      civic_address_ids,
      property_civic_address_id,
      pinnum,
      address,
      property_address,
      city,
      property_city,
      zipcode,
      property_zipcode,
      tax_exempt,
      neighborhood,
      appraisal_area,
      acreage,
      zoning,
      deed_link,
      property_card_link,
      plat_link,
      latitude,
      longitude,
      building_value,
      land_value,
      appraised_value,
      tax_value,
      market_value,
      owner,
      owner_address,
      polygons {
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
  }
`;

const PropertiesByNeighborhoodGQL = graphql(getPropertiesByNeighborhoodQuery, {
  options: ownProps => ({
    variables: {
      nbrhd_ids: [ownProps.location.query.id],
    },
  }),
})(PropertiesByNeighborhood);

export default PropertiesByNeighborhoodGQL;
