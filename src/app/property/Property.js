import React from 'react';
import { graphql } from 'react-apollo';
import ReactTable from 'react-table';
import gql from 'graphql-tag';
import DetailsTable from '../../shared/DetailsTable';
import DetailsFormGroup from '../../shared/DetailsFormGroup';
import DetailsIconLinkFormGroup from '../../shared/DetailsIconLinkFormGroup';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import InCityMessage from '../InCityMessage';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import { zoningLinks } from '../address/zoning';
import Map from '../../shared/visualization/Map';
import { getBoundsFromPropertyPolygons, combinePolygonsFromPropertyList } from '../../utilities/mapUtilities';
import Icon from '../../shared/Icon';
import { IM_PROFILE, IM_USER, IM_GOOGLE, IM_CERTIFICATE, IM_CHECKBOX_PARTIAL2, IM_HOME2 } from '../../shared/iconConstants';

const getDollars = (value) => {
  const initialSymbols = value < 0 ? '-$' : '$';
  return [initialSymbols, Math.abs(value).toLocaleString()].join('');
};

const dataColumns = [
  {
    Header: 'Civic address ID(s)',
    accessor: 'civic_address_id',
    width: 150,
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
    Header: 'Address(es)',
    accessor: 'Address',
    Cell: row => (
      <span>{row.original.address}, {row.original.zipcode}</span>
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

const Property = (props) => {
  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const propertyData = props.inTable ? props.data : props.data.properties[0];
  const dataForAddressesTable = [];
  for (let i = 0; i < propertyData.civic_address_ids.length; i += 1) {
    dataForAddressesTable.push({
      civic_address_id: propertyData.civic_address_ids[i],
      address: propertyData.address[i],
      zipcode: propertyData.zipcode[i],
    });
  }

  return (
    <div>
      {props.inTable !== true &&
        <PageHeader h1={propertyData.pinnum} h3="About this property" icon={<Icon path={IM_HOME2} size={50} />}>
          <ButtonGroup>
            {props.location.query.fromAddress &&
              <LinkButton pathname="/address" query={{ entities: props.location.query.entities, search: props.location.query.search, id: props.location.query.fromAddress, hideNavbar: props.location.query.hideNavbar }} positionInGroup="left">Back to address</LinkButton>
            }
            <LinkButton pathname="/search" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }} positionInGroup={props.location.query.fromAddress ? 'right' : ''}>Back to search</LinkButton>
          </ButtonGroup>
        </PageHeader>
      }
      <div className="row">
        <div className="col-sm-6">
          <fieldset className="detailsFieldset">
            <div className="row">
              <div className="col-xs-12" style={{ marginBottom: '10px' }}>
                <InCityMessage inTheCity={propertyData.is_in_city} />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <div alt={['Table of addresses'].join(' ')} style={{ marginRight: '10px', marginLeft: '10px' }}>
                  <ReactTable
                    data={dataForAddressesTable}
                    columns={dataColumns}
                    showPagination={dataForAddressesTable.length > 5}
                    defaultPageSize={dataForAddressesTable.length <= 5 ? dataForAddressesTable.length : 5}
                    filterable={dataForAddressesTable.length > 5}
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
              </div>
              <div className="col-xs-6">
                <DetailsFormGroup label="Neighborhood" name="neighborhood" value={propertyData.neighborhood} hasLabel />
                <DetailsFormGroup label="Appraisal area" name="appraisal_area" value={propertyData.appraisal_area} hasLabel />
                <DetailsFormGroup
                  label="Zoning"
                  name="zoning"
                  value={<div>{propertyData.zoning.split(',').map((zone, index) => (
                    <span key={['zone', index].join('_')}><a href={zoningLinks[zone]} target="_blank">{propertyData.zoning.split(',')[index]}</a>{propertyData.zoning.split(',').length > index + 1 ? ', ' : ''}</span>)
                  )}</div>} hasLabel
                />
              </div>
              <div className="col-xs-6">
                <DetailsFormGroup label="Pin #" name="pinnum" value={propertyData.pinnum} hasLabel />
                <DetailsFormGroup label="Tax exempt" name="tax_exempt" value={propertyData.tax_exempt ? 'Yes' : 'No'} hasLabel />
                <DetailsFormGroup label="Acreage" name="acreage" value={propertyData.acreage} hasLabel />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <DetailsIconLinkFormGroup label="Deed" title="Deed" href={propertyData.deed_link} icon={<Icon path={IM_CERTIFICATE} size={20} />} />
                <DetailsIconLinkFormGroup label="Property card" title="property_card" href={propertyData.property_card_link} icon={<Icon path={IM_PROFILE} size={20} />} />
              </div>
              <div className="col-xs-6">
                <DetailsIconLinkFormGroup label="Plat" title="Plat" href={propertyData.plat_link} icon={<Icon path={IM_CHECKBOX_PARTIAL2} size={20} />} />
                <DetailsIconLinkFormGroup label="Google map directions" title="Google map directions" href={['https://www.google.com/maps?daddr=', propertyData.latitude, ',', propertyData.longitude].join('')} icon={<Icon path={IM_GOOGLE} size={20} />} />
              </div>
            </div>
          </fieldset>
          <fieldset className="detailsFieldset">
            <DetailsFormGroup label="Owner" name="owner" value={<div><div>{propertyData.owner}</div><div>{propertyData.owner_address}</div></div>} hasLabel icon={<Icon path={IM_USER} size={20} />} />
          </fieldset>
        </div>
        <div className="col-sm-6">
          <fieldset className="detailsFieldset">
            <DetailsTable
              data={[
                { value_type: 'Building value', amount: getDollars(propertyData.building_value) },
                { value_type: 'Land value', amount: getDollars(propertyData.land_value) },
                { value_type: 'Appraised value', amount: getDollars(propertyData.appraised_value) },
                { value_type: 'Tax value', amount: getDollars(propertyData.tax_value) },
                { value_type: 'Total market value', amount: getDollars(propertyData.market_value) },
              ]}
            />
            <Map bounds={getBoundsFromPropertyPolygons(propertyData.polygons)} drawPolygon polygonData={combinePolygonsFromPropertyList([propertyData])} height="250px" />
          </fieldset>
        </div>
      </div>
    </div>
  );
};

const propertyQuery = gql`
  query propertyQuery($pins: [String]!) {
    properties(pins: $pins) {
      civic_address_ids,
      pinnum,
      address,
      city,
      zipcode,
      tax_exempt,
      is_in_city,
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

const PropertyWithData = graphql(propertyQuery, {
  skip: ownProps => (ownProps.inTable),
  options: ownProps => ({ variables: { pins: [ownProps.location.query.id.trim()] } }),
})(Property);

export default PropertyWithData;
