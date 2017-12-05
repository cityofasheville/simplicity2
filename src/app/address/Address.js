import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Icon from '../../shared/Icon';
import { IM_LOCATION, IM_BIN, LI_RECYCLE2, IM_USER, IM_LOCATION2, IM_HOME2 } from '../../shared/iconConstants';
import { zoningLinks } from './zoning';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import DetailsFormGroup from '../../shared/DetailsFormGroup';
import DetailsIconLinkFormGroup from '../../shared/DetailsIconLinkFormGroup';
import TopicCard from '../../shared/TopicCard';
import InCityMessage from '../InCityMessage';
import LoadingAnimation from '../../shared/LoadingAnimation';

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

const Address = (props) => {
  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <p>{props.data.error.message}</p>;
  }

  const addressData = props.data.addresses[0];
  return (
    <div>
      <PageHeader h1={[addressData.address, addressData.zipcode].join(', ')} h3="About this address" icon={<Icon path={IM_LOCATION} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname="/search" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back to search</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-6">
          <fieldset className="detailsFieldset">
            <InCityMessage inTheCity={addressData.is_in_city} />
            <hr style={{ marginTop: '10px', marginBottom: '10px' }} />
            <DetailsFormGroup label="Trash collection" name="trash" value={calculateTrash(addressData.trash_day, addressData.is_in_city)} hasLabel icon={<Icon path={IM_BIN} size={20} />} />
            <DetailsFormGroup label="Recycling collection" name="recycling" value={calculateRecycling(addressData.recycling_pickup_day, addressData.is_in_city, addressData.recycling_pickup_district)} hasLabel icon={<Icon path={LI_RECYCLE2} size={20} viewBox="0 0 24 24" />} />
            <DetailsFormGroup
              label="Zoning"
              name="zoning"
              value={<div>{addressData.zoning.split(',').map((zone, index) => (
                <span key={['zone', index].join('_')}><a href={zoningLinks[zone]} target="_blank">{addressData.zoning.split(',')[index]}</a>{addressData.zoning.split(',').length > index + 1 ? ', ' : ''}</span>)
            )}</div>} hasLabel icon={<Icon path={IM_LOCATION2} size={20} />}
            />
            <DetailsFormGroup label="Owner" name="owner" value={<div><div>{addressData.owner_name}</div><div>{addressData.owner_address}</div></div>} hasLabel icon={<Icon path={IM_USER} size={20} />} />
            <DetailsIconLinkFormGroup label="Property" title="Property" href={['/property/?fromAddress=', props.location.query.id, '&search=', props.location.query.search, '&id=', addressData.pinnum, addressData.pinnumext, '&entities=', props.location.query.entities].join('')} icon={<Icon path={IM_HOME2} size={20} />} inWindow />
            {/*<DetailsIconLinkGrouping dataLabels={['Property', 'Maintenance']} dataTitles={['Property', 'Maintenance']} dataHrefs={[['/property/?pin=', addressData.pinnum].join(''), '/maintenance?entity=address']} dataIcons={['home', 'road']} />*/}
          </fieldset>
        </div>
        <div className="col-sm-6">
          <div className="row">
            {['CRIME', 'DEVELOPMENT'].map((topic, i) => (
              <div className="col-xs-6" key={['topic', i]}>
                <TopicCard topic={topic} entity="address" id={props.location.query.id} label={[addressData.address, addressData.zipcode].join(', ')} entities={props.location.query.entities} x={addressData.x} y={addressData.y} search={props.location.query.search} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const dataShape = {
  address: PropTypes.string,
  zipcode: PropTypes.string,
  trash_day: PropTypes.string,
};

Address.propTypes = {
  data: PropTypes.shape(dataShape).isRequired,
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

Address.defaultProps = {
  data: {
    address: '450 MONTFORD AVE',
    zipcode: '28801',
    city: 'Asheville', //this should probably be changed to be an inTheCity boolean?
  },
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
      pinnumext
      centerline_id
      recycling_pickup_district,
      recycling_pickup_day
    }
  }
`;

const AddressWithData = graphql(addressQuery, {
  options: ownProps => ({ variables: { civicaddress_ids: [ownProps.location.query.id] } }),
})(Address);

export default AddressWithData;
