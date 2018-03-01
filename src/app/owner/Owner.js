import React from 'react';
import { browserHistory } from 'react-router';
import ReactTable from 'react-table';
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

const dataColumns = [
  {
    Header: 'Property',
    id: 'property',
    accessor: property => (<span>{property.property_address}, {property.property_zipcode}</span>),
    minWidth: 335,
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
    Header: 'Civic Address ID',
    accessor: 'property_civic_address_id',
    width: 160,
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
    filterMethod: (filter, row) => {
      const id = filter.pivotId || filter.id;
      return row[id] !== undefined ? String(row[id].props.children).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
    },
  },
  {
    Header: 'Pin #',
    accessor: 'pinnum',
    minWidth: 150,
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
];

const Owner = props => {
  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const refreshLocation = (view) => {
    browserHistory.replace([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&entities=', props.location.query.entities, '&label=', props.location.query.label, '&hideNavbar=', props.location.query.hideNavbar, '&search=', props.location.query.search, '&view=', view].join(''));
  };

  const polygons = Object.keys(props.data.properties).map(key => props.data.properties[key].polygons);

  return (
    <div>
      <PageHeader h1={props.data.properties[0].owner} h3="About this owner's properties" icon={<Icon path={IM_USER} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname="/search" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back to search</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-xs-12">
          <div className="pull-left" style={{ marginTop: '10px', marginBottom: '15px' }}>
            <EmailDownload downloadData={props.data.properties} fileName="properties_by_owner.csv" />
          </div>
          <ButtonGroup>
            <Button onClick={() => refreshLocation('map')} active={props.location.query.view === 'map'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation('list')} active={props.location.query.view === 'list'} positionInGroup="right">List view</Button>
          </ButtonGroup>
        </div>
      </div>


      <div className="row">
        <div className="col-sm-12">
          {
            props.location.query.view === 'map' ?
              <Map bounds={getBoundsFromPropertyList(polygons)} drawPolygon polygonData={combinePolygonsFromPropertyList(props.data.properties)} />
            :
              <div alt={['Table of development'].join(' ')} style={{ marginTop: '10px' }}>
                <ReactTable
                  data={props.data.properties}
                  columns={dataColumns}
                  showPagination={props.data.properties.length > 20}
                  defaultPageSize={props.data.properties.length <= 20 ? props.data.properties.length : 20}
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
                        background: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#4077a5' : 'none',
                        color: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#fff' : '',
                        fontWeight: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? 'bold' : 'normal',
                        fontSize: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '1.2em' : '1em',
                      },
                    };
                  }}
                  SubComponent={row => (
                    <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '15px', backgroundColor: '#f6fcff', borderRadius: '0px', border: '2px solid #4077a5' }}>
                      <Property inTable data={row.original} />
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
