import React from 'react';
import { graphql } from 'react-apollo';
import AccessibleReactTable, { CellFocusWrapper } from 'accessible-react-table';
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
import {
  getBoundsFromPropertyPolygons,
  combinePolygonsFromPropertyList,
} from '../../utilities/mapUtilities';
import Icon from '../../shared/Icon';
import {
  IM_PROFILE,
  IM_GOOGLE,
  IM_CERTIFICATE,
  IM_CHECKBOX_PARTIAL2,
  IM_HOME2,
  IM_LIBRARY,
  IM_FLAG7
} from '../../shared/iconConstants';
import createFilterRenderer from '../../shared/FilterRenderer';

const getDollars = (value) => {
  const initialSymbols = value < 0 ? '-$' : '$';
  return [initialSymbols, Math.abs(value).toLocaleString()].join('');
};

const FilterRenderer = createFilterRenderer('Search...');

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

  const dataColumns = [
    {
      Header: 'Civic address ID(s)',
      accessor: 'civic_address_id',
      width: 150,
      Filter: FilterRenderer,
      filterMethod: (filter, row) => {
        const joinedInfo = row._original.pinnum;
        return row._original !== undefined
          ? joinedInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
          : true;
      },
    },
    {
      Header: 'Address(es)',
      accessor: 'Address',
      innerFocus: true,
      Cell: row => (
        <CellFocusWrapper>
          {(focusRef, focusable) => (
            <span>
              {
                props.inTable
                  ? <span>{row.original.address}, {row.original.zipcode}</span>
                  : (
                    <a
                      href={`/address?search=${props.location.query.search}&id=${row.original.civic_address_id}&entities=${props.location.query.entities}&entity=address`}
                      tabIndex={focusable ? 0 : -1}
                      ref={focusRef}
                    >
                      {row.original.address}, {row.original.zipcode}
                    </a>
                  )
              }
            </span>
          )}
        </CellFocusWrapper>
      ),
      Filter: FilterRenderer,
      filterMethod: (filter, row) => {
        const joinedInfo = [row._original.address, row._original.zipcode].join(', ');
        return row._original !== undefined ?
          joinedInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
      },
    },
  ];

  return (
    <div>
      {props.inTable !== true &&
        <PageHeader
          h1={propertyData.pinnum}
          h2="About this property"
          dataType="Property"
          icon={<Icon path={IM_HOME2} size={50} />}
        >
          <ButtonGroup alignment="">
            {props.location.query.fromAddress &&
              <LinkButton
                pathname="/address"
                query={{
                  entities: props.location.query.entities,
                  search: props.location.query.search,
                  id: props.location.query.fromAddress,
                  hideNavbar: props.location.query.hideNavbar
                }}
                positionInGroup="left"
              >Back to address
              </LinkButton>
            }
            <LinkButton
              pathname="/search"
              query={{
                entities: props.location.query.entities,
                search: props.location.query.search,
                hideNavbar: props.location.query.hideNavbar
              }}
              positionInGroup={props.location.query.fromAddress ? 'right' : ''}
            >Back to search
            </LinkButton>
          </ButtonGroup>
        </PageHeader>
      }
      <div className="row">
        <div className="col-sm-12">
          <fieldset className="detailsFieldset">
            <div className="row">
              <div className="col-xs-12">
                <InCityMessage inTheCity={propertyData.is_in_city} />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <div className="map-container">
                  <Map
                    bounds={getBoundsFromPropertyPolygons(propertyData.polygons)}
                    drawPolygon
                    polygonData={combinePolygonsFromPropertyList([propertyData])}
                    height="250px"
                  />
                </div>
                <div
                  className="detailsFieldset__details-listings detailsFieldset__details-listings--three-column"
                >
                  <DetailsIconLinkFormGroup
                    colWidth="6"
                    label="Deed"
                    title="Deed"
                    href={propertyData.deed_link}
                    icon={<Icon path={IM_CERTIFICATE} size={20} />}
                  />
                  <DetailsIconLinkFormGroup
                    colWidth="6"
                    label="Property card"
                    title="property_card"
                    href={propertyData.property_card_link}
                    icon={<Icon path={IM_PROFILE} size={20} />}
                  />
                  <DetailsIconLinkFormGroup
                    colWidth="6"
                    label="Plat"
                    title="Plat"
                    href={propertyData.plat_link}
                    icon={<Icon path={IM_CHECKBOX_PARTIAL2} size={20} />}
                  />
                  <DetailsIconLinkFormGroup
                    colWidth="6"
                    label="Google map directions"
                    title="Google map directions"
                    href={[
                      'https://www.google.com/maps?daddr=',
                      propertyData.latitude,
                      ',',
                      propertyData.longitude].join('')
                    }
                    icon={<Icon path={IM_GOOGLE} size={20} />}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <DetailsTable
                  data={[
                    {
                      value_type: 'Building value',
                      amount: getDollars(propertyData.building_value),
                    },
                    {
                      value_type: 'Land value',
                      amount: getDollars(propertyData.land_value),
                    },
                    {
                      value_type: 'Appraised value',
                      amount: getDollars(propertyData.appraised_value),
                    },
                    {
                      value_type: 'Tax value',
                      amount: getDollars(propertyData.tax_value),
                    },
                    {
                      value_type: 'Total market value',
                      amount: getDollars(propertyData.market_value),
                    },
                  ]}
                />
                <div className="detailsFieldset__details-listings">
                  <DetailsFormGroup
                    colWidth="6"
                    label="Owner"
                    name="owner"
                    value={
                      <div>
                        <div>
                          {propertyData.owner}
                        </div>
                        <div>
                          {propertyData.owner_address}
                        </div>
                      </div>
                    }
                    hasLabel
                  />
                  <DetailsFormGroup
                    colWidth="6"
                    label="Acreage"
                    name="acreage"
                    value={propertyData.acreage}
                    hasLabel
                  />
                </div>
                <div
                  className="detailsFieldset__details-listings"
                >
                  <DetailsFormGroup
                    colWidth="6"
                    label="Neighborhood"
                    name="neighborhood"
                    value={propertyData.neighborhood}
                    hasLabel
                  />
                  <DetailsFormGroup
                    colWidth="6"
                    label="Pin #"
                    name="pinnum"
                    value={propertyData.pinnum}
                    hasLabel
                  />
                </div>
                <div className="detailsFieldset__details-listings">
                  <DetailsFormGroup
                    colWidth="6"
                    label="Tax exempt"
                    name="tax_exempt"
                    value={propertyData.tax_exempt ? 'Yes' : 'No'}
                    hasLabel
                  />
                  <DetailsFormGroup
                    colWidth="6"
                    label="Appraisal area"
                    name="appraisal_area"
                    value={propertyData.appraisal_area}
                    hasLabel
                  />
                  <DetailsFormGroup
                    label="Zoning"
                    name="zoning"
                    colWidth="6"
                    value={
                      <div>
                        {
                          propertyData.zoning.split(',').map((zone, index) => (
                            <span
                              key={['zone', index].join('_')}
                            >
                              <a
                                href={zoningLinks[zone]}
                                target="_blank"
                              >{propertyData.zoning.split(',')[index]}
                              </a>
                              {
                                propertyData.zoning.split(',').length > index + 1 ? ', ' : ''}
                            </span>))
                        }
                        {
                          propertyData.local_landmark &&
                          <DetailsFormGroup
                            label="Local Landmark"
                            name="local_landmark"
                            value={
                              <div>
                                <div>
                                  {propertyData.local_landmark}
                                </div>
                              </div>
                            }
                            hasLabel
                            icon={<Icon path={IM_FLAG7} size={20} />}
                          />
                        }
                        {
                          propertyData.historic_district &&
                            <DetailsFormGroup
                              label="Historic District"
                              name="historic_district"
                              value={
                                <div>
                                  <div>
                                    {propertyData.historic_district}
                                  </div>
                                </div>
                              }
                              hasLabel
                              icon={<Icon path={IM_LIBRARY} size={20} />}
                            />
                        }
                      </div>
                    }
                    hasLabel
                  />
                </div>
                <AccessibleReactTable
                  ariaLabel="Property Addresses"
                  data={dataForAddressesTable}
                  columns={dataColumns}
                  showPagination={dataForAddressesTable.length > 5}
                  defaultPageSize={
                    dataForAddressesTable.length <= 5 ? dataForAddressesTable.length : 5
                  }
                  filterable={dataForAddressesTable.length > 5}
                  defaultFilterMethod={(filter, row) => {
                    const id = filter.pivotId || filter.id;
                    return row[id] !== undefined ?
                      String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
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
      local_landmark
      historic_district
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
