import React from 'react';
import PropTypes from 'prop-types';
import DetailsIconLinkFormGroup from '../../shared/DetailsIconLinkFormGroup';
import TopicCard from '../../shared/TopicCard';
import Icon from '../../shared/Icon';
import { IM_ENVELOP3, IM_USERS, IM_HOME2 } from '../../shared/iconConstants';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';

const Neighborhood = props => (
  <div>
    <PageHeader h1={props.location.query.label} h3="About this neighborhood" icon={<Icon path={IM_USERS} size={50} />}>
      <ButtonGroup>
        <LinkButton pathname="/search" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back to search</LinkButton>
      </ButtonGroup>
    </PageHeader>
    <div className="row">
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsIconLinkFormGroup label="Address & Owner Mailing Lists" icon={<Icon path={IM_ENVELOP3} size={24} />} href={['address/addressList', '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Address & Owner Mailing Lists" inWindow />
          <DetailsIconLinkFormGroup label="Properties" icon={<Icon path={IM_HOME2} size={24} />} href={['property/properties', '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&search=', props.location.query.search, '&label=', props.location.query.label, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Properties" inWindow />
        </fieldset>
      </div>
      <div className="col-sm-6">
        <div className="row">
          {props.topics.map((topic, i) => (
            <div className="col-xs-6" key={['topic', i].join('_')}>
              <TopicCard topic={topic} entity="neighborhood" id={props.location.query.id} label={props.location.query.label} entities={props.location.query.entities} search={props.location.query.search} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const iconLinksDataShape = {
  icons: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  labels: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  hrefs: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

Neighborhood.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  topics: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  iconLinksData: PropTypes.shape(iconLinksDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
};

// TODO - this is temporary dummy data
Neighborhood.defaultProps = {
  neighborhoodName: 'Montford',
  topics: [
    'CRIME',
    'DEVELOPMENT',
  ],
  iconLinksData: {
    icons: [
      'file-text',
      'envelope',
      'file-text',
      'envelope',
    ],
    labels: ['Addresses',
      'Resident mailing addresses',
      'Property owner addresses',
      'Property owner mailing addresses',
    ],
    hrefs: [
      '/address/addressList?entity=neighborhood&id=Montford&label=Montford&type=addresses',
      '/address/addressList?entity=neighborhood&id=Montford&label=Montford&type=residentMailing',
      '/address/addressList?entity=neighborhood&id=Montford&label=Montford&type=ownerAddresses',
      '/address/addressList?entity=neighborhood&id=Montford&label=Montford&type=ownerMailing',
      '/property/properties?entity=neighborhood&id=Montford&label=Montford',
    ],
  },
};

export default Neighborhood;
