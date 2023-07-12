import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Icon from '../../shared/Icon';
import { Link } from 'react-router';
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
  IM_INFO,
  IM_FLAG7,
  IM_LIBRARY,
} from '../../shared/iconConstants';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import DetailsFormGroup from '../../shared/DetailsFormGroup';
import DetailsIconLinkFormGroup from '../../shared/DetailsIconLinkFormGroup';
import TopicCard from '../../shared/TopicCard';
import InCityMessage from '../../shared/InCityMessage';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import Map from '../../shared/visualization/Map';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';
import ClimateJustice from '../../shared/ClimateJustice';

const GET_ADDRESSES = gql`
query addresses($civicaddress_ids: [String]!) {
  addresses(civicaddress_ids: $civicaddress_ids) {
    address
      zipcode
      trash_day
      brushweek
      zoning
      zoning_links
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
      street_type
      city
      neighborhood
      owner_cityname
      owner_state
      owner_zipcode
      local_landmark
      historic_district
      block_group
      climate_justice_score
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
      console.log('props:', props);
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;
      // set language
      let content;
      switch (props.language.language) {
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
            return (
              <span>
                {content.sometime_this_week}
                <span title={content.place_on_curb_by_7am_monday} style={{ marginLeft: '4px' }} >
                  <Icon path={IM_INFO} size={16} />
                </span>
                <br />
                {`(${content.brush_week} ${week})`}
              </span>
            );
          }
          return (
            <span>
              {content.sometime_next_week}
              <span title={content.place_on_curb_by_7am_monday} style={{ marginLeft: '4px' }} >
                <Icon path={IM_INFO} size={16} />
              </span>
              <br />
              {`(${content.brush_week} ${week})`}
            </span>
          );
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
                  href="https://iframe.publicstuff.com/#?client_id=819"
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
            h2={content.about_this_address}
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
            <div className="col-sm-12">
              <fieldset className="detailsFieldset">
                <InCityMessage inTheCity={addressData.is_in_city} />
                <div className="map-container">
                  <Map
                    data={mapData}
                    center={[addressData.y, addressData.x]}
                    height="100%"
                    width="100%"
                  />
                </div>
                {addressData.is_in_city &&
                  // <div className="col-sm-12">
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
                        />
                      </div>
                    ))}
                  </div>
                  // </div>
                }
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
                    label={content.block_group}
                    name="block_groups"
                    value={addressData.block_group === null ?
                      content.no_block_group
                      :
                      <div>
                      <div>
                      Climate Justice Score: <b>{addressData.climate_justice_score}</b> out of 25
                      </div>
                      <Link to={`/block_group?id=${addressData.block_group}&fromAddress=${props.location.query.id}&search=${props.location.query.search}`}>
                      More Information
                      </Link>
                      </div>
                    }
                    hasLabel
                    icon={<Icon path={IM_USERS} size={20} />}
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
                  <DetailsFormGroup
                    label={content.zoning}
                    name="zoning"
                    value={
                      <div>
                        {addressData.zoning.split(',').map((zone, index) => (
                          <span
                            key={`zone_${index}`}
                          >
                            {addressData.zoning_links
                              ? <a
                                href={addressData.zoning_links.split(',')[index]}
                                target="_blank"
                              >
                                {addressData.zoning.split(',')[index]}
                              </a>
                              : addressData.zoning.split(',')[index]
                            }

                            {addressData.zoning.split(',').length > index + 1 ? ', ' : ''}
                          </span>
                        ))}
                        {
                          addressData.local_landmark &&
                          <DetailsFormGroup
                            label={content.local_landmark}
                            name="local_landmark"
                            value={
                              <div>
                                <div>
                                  {addressData.local_landmark}
                                </div>
                              </div>
                            }
                            hasLabel
                            icon={<Icon path={IM_FLAG7} size={20} />}
                          />
                        }
                        {
                          addressData.historic_district &&
                          <DetailsFormGroup
                            label={content.historic_district}
                            name="historic_district"
                            value={
                              <div>
                                <div>
                                  {addressData.historic_district}
                                </div>
                              </div>
                            }
                            hasLabel
                            icon={<Icon path={IM_LIBRARY} size={20} />}
                          />
                        }
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
                </div>
              </fieldset>
              {/* <DetailsFormGroup 
                label="Neighborhood Climate Threats"
                name="climate"
                fullWidth="true"
                value={
                  <ClimateJustice inCity={addressData.is_in_city} civicAddress={props.location.query.id.trim()} pinnum={0} />
                }
                hasLabel
              /> */}
            </div>
          </div>
        </div>
      );
    }}
  </Query>
);

export default withLanguage(Address);
