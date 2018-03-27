import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Icon from '../../shared/Icon';
import { IM_LOCATION, IM_BIN, LI_RECYCLE2, IM_USER, IM_LOCATION2, IM_HOME2, IM_TRAFFIC_CONE } from '../../shared/iconConstants';
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
  if (inCity) {
    if (getCurrentRecyclingWeek() === week) {
      return ['this week on ', dayOfWeek, ' (Recycle Week ', week, ')'].join('');
    }
    return ['next week on ', dayOfWeek, ' (Recycle Week ', week, ')'].join('');
  }
  return 'No recycling collection information available';
};

const calculateTrash = (dayOfWeek, inCity) => {
  if (inCity) {
    return ['every', dayOfWeek].join(' ');
  }
  return 'No trash collection information available';
};

const getMaintenanceInfo = (entity) => {
  if (entity === null) {
    return <div>No information available</div>;
  }
  if (entity === 'CITY OF ASHEVILLE') {
    return (<div><span><a href="http://www.ashevillenc.gov/departments/street_services/maintenance.htm" target="_blank">{entity}</a></span><span style={{ marginLeft: '10px' }}><a href="http://www.ashevillenc.gov/departments/it/online/service_requests.htm" target="_blank"><button className="btn btn-xs btn-warning">Report with the Asheville App</button></a>
    </span></div>);
  }
  if (entity === 'NCDOT') {
    return <div><span><a href="https://apps.ncdot.gov/contactus/Home/PostComment?Unit=PIO" target="_blank">{entity}</a></span></div>;
  }
  return <div>{entity}</div>;
};

const Address = (props) => {
  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const addressData = props.data.addresses[0];
  const mapData = [Object.assign({}, addressData, { popup: `<b>Address</b><div>${addressData.street_number} ${addressData.street_prefix} ${addressData.street_name} ${addressData.unit || ''}</div><div>${addressData.city}, NC ${addressData.zipcode}</div><br /><b>Owner</b><div>${addressData.owner_name}</div><div>${addressData.owner_address}</div><div>${addressData.owner_cityname}, ${addressData.owner_state} ${addressData.owner_zipcode}</div>` })];

  return (
    <div>
      <PageHeader h1={[addressData.address, addressData.zipcode].join(', ')} h3="About this address" icon={<Icon path={IM_LOCATION} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname="/search" positionInGroup="left" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back to search</LinkButton>
          {props.location.query.placeSearch &&
            <LinkButton positionInGroup="right" pathname="/search/googlePlaceMatches" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar, placeSearch: props.location.query.placeSearch }}>Back to place matches</LinkButton>
          }
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-7">
          <fieldset className="detailsFieldset">
            <InCityMessage inTheCity={addressData.is_in_city} />
            <div className="col-xs-12" style={{ marginBottom: '15px', marginTop: '10px' }}>
              <Map
                height="250px"
                data={mapData}
                center={[addressData.y, addressData.x]}
              />
            </div>
            <DetailsFormGroup label="Trash collection" name="trash" value={calculateTrash(addressData.trash_day, addressData.is_in_city)} colWidth="5" hasLabel icon={<Icon path={IM_BIN} size={20} />} />
            <DetailsFormGroup label="Recycling collection" name="recycling" value={calculateRecycling(addressData.recycling_pickup_day, addressData.is_in_city, addressData.recycling_pickup_district)} hasLabel colWidth="7" icon={<Icon path={LI_RECYCLE2} size={20} viewBox="0 0 24 24" />} />
            <DetailsFormGroup
              label="Zoning"
              name="zoning"
              colWidth="5"
              value={<div>{addressData.zoning.split(',').map((zone, index) => (
                <span key={['zone', index].join('_')}><a href={zoningLinks[zone]} target="_blank">{addressData.zoning.split(',')[index]}</a>{addressData.zoning.split(',').length > index + 1 ? ', ' : ''}</span>)
            )}</div>} hasLabel icon={<Icon path={IM_LOCATION2} size={20} />}
            />
            <DetailsFormGroup
              label="Street maintenance"
              name="street_maintenance"
              colWidth="7"
              value={getMaintenanceInfo(addressData.street_maintenance)}
              hasLabel
              icon={<Icon path={IM_TRAFFIC_CONE} size={20} />}
            />
            <DetailsIconLinkFormGroup label="Property information" colWidth="5" title="Property information" href={['/property/?fromAddress=', props.location.query.id, '&search=', props.location.query.search, '&id=', addressData.pinnum, '&entities=', props.location.query.entities].join('')} icon={<Icon path={IM_HOME2} size={20} />} inWindow />
            <DetailsFormGroup label="Owner" name="owner" value={<div><div>{addressData.owner_name}</div><div>{addressData.owner_address}</div></div>} colWidth="7" hasLabel icon={<Icon path={IM_USER} size={20} />} />
          </fieldset>
        </div>
        {addressData.is_in_city &&
          <div className="col-sm-5">
            <div className="row">
              {['CRIME', 'DEVELOPMENT'].map((topic, i) => (
                <div className="col-xs-6" key={['topic', i]}>
                  <TopicCard topic={topic} entity="address" id={props.location.query.id} label={[addressData.address, addressData.zipcode].join(', ')} entities={props.location.query.entities} x={addressData.x} y={addressData.y} search={props.location.query.search} />
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

const addressQuery = gql`
  query addressQuery($civicaddress_ids: [String]!) {
    addresses(civicaddress_ids: $civicaddress_ids) {
      address
      zipcode
      trash_day
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
      owner_cityname
      owner_state
      owner_zipcode
    }
  }
`;

const AddressWithData = graphql(addressQuery, {
  options: ownProps => ({ variables: { civicaddress_ids: [ownProps.location.query.id.trim()] } }),
})(Address);

export default AddressWithData;
