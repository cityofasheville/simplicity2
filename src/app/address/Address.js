import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Icon from '../../shared/Icon';
import {
  IM_LOCATION,
  IM_BIN,
  LI_RECYCLE2,
  IM_USER,
  IM_USERS,
  IM_LOCATION2,
  IM_HOME2,
  IM_TRAFFIC_CONE,
  IM_LEAF,
} from '../../shared/iconConstants';
import { zoningLinks } from './zoning';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import DetailsFormGroup from '../../shared/DetailsFormGroup';
import DetailsIconLinkFormGroup from '../../shared/DetailsIconLinkFormGroup';
import TopicCard from '../../shared/TopicCard';
import InCityMessage from '../InCityMessage';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import Map from '../../shared/visualization/Map';
import { english } from './english';
import { spanish } from './spanish';

const GET_ADDRESSES = gql`
query addresses($civicaddress_ids: [String]!) {
  addresses(civicaddress_ids: $civicaddress_ids) {
    address
      zipcode
      trash_day
      brushweek
      zoning
      owner_name
      owner_address
      centerline_id
      is_in_city
      x
      y
      pinnum
      centerline_id
      recycling_pickup_district
      recycling_pickup_day
      street_maintenance
      street_number
      street_prefix
      street_name
      city
      neighborhood
      owner_cityname
      owner_state
      owner_zipcode
    }
    language @client {
      lang
    }
  }
  `;

const Address = props => (
  <Query
    query={GET_ADDRESSES}
    variables={{
      civicaddress_ids: [props.location.query.id.trim()]
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
      const getCurrentRecyclingWeek = () => {
        const d = new Date(); // current time
        const t = d.getTime() - (1000 * 60 * 60 * 24 * 3); // milliseconds since Jan 4 1970 Sunday
        const w = Math.floor(t / (1000 * 60 * 60 * 24 * 7)); // weeks since Jan 4 1970
        const o = w % 2; // equals 0 for even (B weeks) numbered weeks, 1 for odd numbered weeks
        if (o === 0) {
          return 'B';
        }
        // do your odd numbered week stuff
        return 'A';
      };
      const calculateRecycling = (dayOfWeek, inCity, week) => {
        if (dayOfWeek !== null) {
          if (getCurrentRecyclingWeek() === week) {
            return `${content.weekdays[dayOfWeek]} ${content.of_this_week} (${content.recycle_week} ${week})`; // eslint-disable-line
          }
          return `${content.weekdays[dayOfWeek]} ${content.of_next_week} (${content.recycle_week} ${week})`; // eslint-disable-line
        }
        if (inCity) {
          return content.no_information_available;
        }
        return content.no_city_pickup;
      };
      const calculateBrushDay = (dayOfWeek, inCity, week) => {
        if (dayOfWeek !== null) {
          if (getCurrentRecyclingWeek() === week) {
            return `${content.weekdays[dayOfWeek]} ${content.of_this_week} (${content.brush_week} ${week})`; // eslint-disable-line
          }
          return `${content.weekdays[dayOfWeek]} ${content.of_next_week} (${content.brush_week} ${week})`; // eslint-disable-line
        }
        if (inCity) {
          return content.no_information_available;
        }
        return content.no_city_pickup;
      };
      const calculateTrash = (dayOfWeek, inCity) => {
        if (dayOfWeek !== null) {
          return `${content.every} ${content.weekdays[dayOfWeek]}`;
        }
        if (inCity) {
          return content.no_information_available;
        }
        return content.no_city_pickup;
      };
      const getMaintenanceInfo = (entity) => {
        if (entity === null) {
          return <div>{content.no_information_available}</div>;
        }
        if (entity === 'CITY OF ASHEVILLE') {
          return (
            <div>
              <span>
                <a
                  href="http://www.ashevillenc.gov/departments/street_services/maintenance.htm"
                  target="_blank"
                >
                  {entity}
                </a>
              </span>
              <span className="form-group__call-to-action">
                <a
                  href="http://www.ashevillenc.gov/departments/it/online/service_requests.htm"
                  target="_blank"
                >
                  <button className="btn btn-xs btn-warning">
                    {content.report_with_the_asheville_app}
                  </button>
                </a>
              </span>
            </div>
          );
        }
        if (entity === 'NCDOT') {
          return (
            <div>
              <span>
                <a
                  href="https://apps.ncdot.gov/contactus/Home/PostComment?Unit=PIO"
                  target="_blank"
                >
                  {entity}
                </a>
              </span>
            </div>
          );
        }
        return <div>{entity}</div>;
      };
      const addressData = data.addresses[0];
      const mapData = [Object.assign(
        {},
        addressData,
        { popup: `<b>${content.address}</b><div>${addressData.street_number} ${addressData.street_prefix} ${addressData.street_name} ${addressData.unit || ''}</div><div>${addressData.city}, NC ${addressData.zipcode}</div><br /><b>${content.owner}</b><div>${addressData.owner_name}</div><div>${addressData.owner_address}</div><div>${addressData.owner_cityname}, ${addressData.owner_state} ${addressData.owner_zipcode}</div>` } // eslint-disable-line
      )];

      return (
        <div className="address">
          <PageHeader
            h1={`${addressData.address}, ${addressData.zipcode}`}
            dataType={content.data_type}
            h3={content.about_this_address}
            icon={<Icon path={IM_LOCATION} size={50} />}
          >
            <ButtonGroup alignment="">
              <LinkButton
                pathname="/search"
                positionInGroup={props.location.query.placeSearch ? 'left' : ''}
                query={{
                  entities: props.location.query.entities,
                  search: props.location.query.search,
                  hideNavbar: props.location.query.hideNavbar,
                }}
              >
                {content.back_to_search}
              </LinkButton>
              {props.location.query.placeSearch &&
                <LinkButton
                  positionInGroup="right"
                  pathname="/search/googlePlaceMatches"
                  query={{
                    entities: props.location.query.entities,
                    search: props.location.query.search,
                    hideNavbar: props.location.query.hideNavbar,
                    placeSearch: props.location.query.placeSearch,
                  }}
                >
                  {content.back_to_place_matches}
                </LinkButton>
              }
            </ButtonGroup>
          </PageHeader>
          <div className="row">
            <div className="col-sm-7">
              <fieldset className="detailsFieldset">
                <InCityMessage inTheCity={addressData.is_in_city} lang={data.language.lang} />
                <div className="map-container">
                  <Map
                    data={mapData}
                    center={[addressData.y, addressData.x]}
                    height="100%"
                    width="100%"
                  />
                </div>
                <div className="detailsFieldset__details-listings">
                  <DetailsFormGroup
                    label={content.trash_collection}
                    name="trash"
                    value={calculateTrash(addressData.trash_day, addressData.is_in_city)}
                    hasLabel
                    icon={<Icon path={IM_BIN} size={20} />}
                  />
                  <DetailsFormGroup
                    label={content.recycling_collection}
                    name="recycling"
                    value={calculateRecycling(
                      addressData.recycling_pickup_day,
                      addressData.is_in_city,
                      addressData.recycling_pickup_district
                    )}
                    hasLabel
                    icon={<Icon path={LI_RECYCLE2} size={20} viewBox="0 0 24 24" />}
                  />
                  <DetailsFormGroup
                    label={content.brush_collection}
                    name="brush"
                    value={calculateBrushDay(
                      addressData.recycling_pickup_day,
                      addressData.is_in_city,
                      addressData.brushweek
                    )}
                    hasLabel
                    icon={<Icon path={IM_LEAF} size={20} />}
                  />
                  <DetailsFormGroup
                    label={content.street_maintenance}
                    name="street_maintenance"
                    value={getMaintenanceInfo(addressData.street_maintenance)}
                    hasLabel
                    icon={<Icon path={IM_TRAFFIC_CONE} size={20} />}
                  />
                  {
                    addressData.is_in_city &&
                    <DetailsFormGroup
                      label={content.neighborhood}
                      name="neighborhood"
                      value={addressData.neighborhood === null ?
                        content.no_neighborhood_name
                        :
                        addressData.neighborhood}
                      hasLabel
                      icon={<Icon path={IM_USERS} size={20} />}
                    />
                  }
                  <DetailsFormGroup
                    label={content.zoning}
                    name="zoning"
                    value={
                      <div>
                        {addressData.zoning.split(',').map((zone, index) => (
                          <span
                            key={`zone_${index}`}
                          >
                            <a
                              href={zoningLinks[zone]}
                              target="_blank"
                            >
                              {addressData.zoning.split(',')[index]}
                            </a>
                            {addressData.zoning.split(',').length > index + 1 ? ', ' : ''}
                          </span>))}
                      </div>}
                    hasLabel
                    icon={<Icon path={IM_LOCATION2} size={20} />
                    }
                  />
                  <DetailsIconLinkFormGroup
                    label={content.property_information}
                    title={content.property_information}
                    href={`/property/?fromAddress=${props.location.query.id}&search=${props.location.query.search}&id=${addressData.pinnum}&entities=${props.location.query.entities}`} // eslint-disable-line
                    icon={<Icon path={IM_HOME2} size={20} />}
                    inWindow
                  />
                  <DetailsFormGroup
                    label={content.owner}
                    name="owner"
                    value={
                      <div>
                        <div>
                          {addressData.owner_name}
                        </div>
                        <div>
                          {addressData.owner_address}
                        </div>
                      </div>
                    }
                    hasLabel
                    icon={<Icon path={IM_USER} size={20} />}
                  />
                </div>
              </fieldset>
            </div>
            {addressData.is_in_city &&
              <div className="col-sm-5">
                <div className="row small-padding">
                  {['CRIME', 'DEVELOPMENT'].map((topic, i) => (
                    <div className="col-xs-6" key={['topic', i]}>
                      <TopicCard
                        topic={topic}
                        entity="address"
                        id={props.location.query.id}
                        label={`${addressData.address}, ${addressData.zipcode}`}
                        entities={props.location.query.entities}
                        x={addressData.x}
                        y={addressData.y}
                        search={props.location.query.search}
                        lang={data.language.lang}
                      />
                    </div>
                  ))}
                </div>
              </div>
            }
          </div>
        </div>
      );
    }}
  </Query>
);

export default Address;
