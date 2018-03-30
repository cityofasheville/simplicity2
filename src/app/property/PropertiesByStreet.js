import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Map from '../../shared/visualization/Map';
import EmailDownload from '../../shared/EmailDownload';
import Property from './Property';
import { getBoundsFromStreetData, convertStreetLinesToLatLngArrays, combinePolygonsFromPropertyList } from '../../utilities/mapUtilities';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import expandingRows from '../../shared/react_table_hoc/ExpandingRows'

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

const PropertiesByStreet = props => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <EmailDownload downloadData={props.data.properties_by_street} fileName="properties_by_street.csv" />
        </div>
        <div id="listView" className="col-sm-12" hidden={props.location.query.view !== 'list'}>
          {props.data.properties_by_street.length < 1 ?
            <div className="alert alert-info">No results found</div>
          :
            <div alt={['Table of addresses'].join(' ')} style={{ marginTop: '10px' }}>
              <ExpandableAccessibleReactTable
                ariaLabel="Street Properties"
                data={props.data.properties_by_street}
                columns={dataColumns}
                showPagination={props.data.properties_by_street.length > 20}
                defaultPageSize={props.data.properties_by_street.length <= 20 ? props.data.properties_by_street.length : 20}
                filterable
                defaultFilterMethod={(filter, row) => {
                  const id = filter.pivotId || filter.id;
                  return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
                }}
                getTdProps={() => {
                  return {
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

        <div id="mapView" className="col-xs-12" hidden={props.location.query.view === 'list'}>
          {props.data.properties_by_street.length === 0 || props.location.query.view === 'list' ?
            <div className="alert alert-info">No results found</div>
            :
            <Map bounds={getBoundsFromStreetData(props.data.streets)} drawStreet streetData={convertStreetLinesToLatLngArrays(props.data.streets)} drawPolygon polygonData={combinePolygonsFromPropertyList(props.data.properties_by_street)} />
          }
        </div>
      </div>
    </div>
  );
};

PropertiesByStreet.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

PropertiesByStreet.defaultProps = {
  spatialEventTopic: 'crime',
  query: { entity: 'address', label: '123 Main street' },
};

const getPropertiesAndStreetInfoQuery = gql`
  query getPropertiesAndStreetInfoQuery($centerline_ids: [Float]) {
    properties_by_street (centerline_ids: $centerline_ids) {
      civic_address_ids
      pinnum
      address
      city
      zipcode
      property_civic_address_id
      property_address
      property_city
      is_in_city
      property_zipcode
      tax_exempt
      neighborhood
      appraisal_area
      acreage
      zoning
      deed_link
      property_card_link
      plat_link
      latitude
      longitude
      building_value
      land_value
      appraised_value
      tax_value
      market_value
      owner
      owner_address
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

const PropertiesByStreetGQL = graphql(getPropertiesAndStreetInfoQuery, {
  options: ownProps => ({
    variables: {
      centerline_ids: ownProps.location.query.id.trim().split(','),
    },
  }),
})(PropertiesByStreet);

export default PropertiesByStreetGQL;
