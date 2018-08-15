import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import Property from '../property/Property';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import LinkButton from '../../shared/LinkButton';
import EmailDownload from '../../shared/EmailDownload';
import Icon from '../../shared/Icon';
import { IM_USER } from '../../shared/iconConstants';
import { getBoundsFromPropertyList, combinePolygonsFromPropertyList } from '../../utilities/mapUtilities';
import Map from '../../shared/visualization/Map';
import { refreshLocation } from '../../utilities/generalUtilities';
import expandingRows from '../../shared/react_table_hoc/ExpandingRows';
import createFilterRenderer from '../../shared/FilterRenderer';

const FilterRenderer = createFilterRenderer('Search...');

const dataColumns = [
  {
    Header: 'Property',
    id: 'property',
    accessor: property => (<span>{property.property_address}, {property.property_zipcode}</span>),
    minWidth: 335,
    Filter: FilterRenderer,
  },
  {
    Header: 'Civic Address ID',
    accessor: 'property_civic_address_id',
    width: 160,
    Filter: FilterRenderer,
    filterMethod: (filter, row) => {
      const id = filter.pivotId || filter.id;
      return row[id] !== undefined ? String(row[id].props.children).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
    },
  },
  {
    Header: 'Pin #',
    accessor: 'pinnum',
    minWidth: 150,
    Filter: FilterRenderer,
  },
];

const Owner = (props) => {
  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const getNewUrlParams = view => (
    {
      view,
    }
  );

  const polygons = Object.keys(props.data.properties).map(key => props.data.properties[key].polygons);

  const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

  return (
    <div>
      <PageHeader h1={props.data.properties[0].owner} h2="About this owner's properties" dataType="Owner" icon={<Icon path={IM_USER} size={50} />}>
        <ButtonGroup alignment="">
          <LinkButton pathname="/search" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back to search</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-xs-12">
          <div className="pull-left" style={{ marginTop: '10px', marginBottom: '15px' }}>
            <EmailDownload downloadData={props.data.properties} fileName="properties_by_owner.csv" text="Download CSV" />
          </div>
          <ButtonGroup alignment="right">
            <Button onClick={() => refreshLocation(getNewUrlParams('map'), props.location)} active={props.location.query.view === 'map'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('list'), props.location)} active={props.location.query.view === 'list'} positionInGroup="right">List view</Button>
          </ButtonGroup>
        </div>
      </div>


      <div className="row">
        <div className="col-sm-12">
          {
            props.location.query.view === 'map' ?
              <Map bounds={getBoundsFromPropertyList(polygons)} drawPolygon polygonData={combinePolygonsFromPropertyList(props.data.properties)} />
              :
              <div style={{ marginTop: '10px' }}>
                <ExpandableAccessibleReactTable
                  ariaLabel="Owner's Properties"
                  data={props.data.properties}
                  columns={dataColumns}
                  showPagination={props.data.properties.length > 20}
                  defaultPageSize={props.data.properties.length <= 20 ? props.data.properties.length : 20}
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
                        background: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#4077a5' : 'none',
                        color: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#fff' : '',
                        fontWeight: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? 'bold' : 'normal',
                        fontSize: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '1.2em' : '1em',
                      },
                    };
                  }}
                  SubComponent={row => (
                    <div style={{
                      paddingLeft: '34px', paddingRight: '34px', paddingTop: '15px', backgroundColor: '#f6fcff', borderRadius: '0px', border: '2px solid #4077a5',
                    }}
                    >
                      <Property inTable data={row.original} location={props.location} />
                    </div>
                  )}
                />
              </div>
          }
        </div>
      </div>
    </div>
  );
};

const propertyQuery = gql`
  query propertyQuery($pins: [String]!) {
    properties(pins: $pins) {
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
  }
`;

const OwnerWithData = graphql(propertyQuery, {
  options: ownProps => ({ variables: { pins: (ownProps.location === undefined) ? ownProps.pins : ownProps.location.query.id.trim().split(',') } }),
})(Owner);

export default OwnerWithData;
