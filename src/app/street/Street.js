import React from 'react';
import PropTypes from 'prop-types';
import DetailsIconLinkFormGroup from '../../shared/DetailsIconLinkFormGroup';
import TopicCard from '../../shared/TopicCard';
import Icon from '../../shared/Icon';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import { IM_ENVELOP3, IM_ROAD } from '../../shared/iconConstants';

const Street = props => (
  <div>
    <PageHeader h1={props.location.query.label} h3="About this property" icon={<Icon path={IM_ROAD} size={50} />}>
      <ButtonGroup>
        <LinkButton pathname="/search" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back to search</LinkButton>
      </ButtonGroup>
    </PageHeader>
    <div className="row">
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsIconLinkFormGroup label="Address & Owner Mailing Lists" icon={<Icon path={IM_ENVELOP3} size={24} />} href={['address/addressList', '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Address & Owner Mailing Lists" inWindow />
          <DetailsIconLinkFormGroup label="Properties" icon={'<div>ICON</div>'} href={['property/properties', '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&search=', props.location.query.search, '&label=', props.location.query.label, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Properties" inWindow />
          <DetailsIconLinkFormGroup label="Maintenance" icon={'<div>ICON</div>'} href={['address/addressList', '?entity=', props.location.query.entity, '&search=', props.location.query.search, '&id=', props.location.query.id, '&label=', props.location.query.label, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Maintenance" inWindow />
        </fieldset>
      </div>
      <div className="col-sm-6">
        <div className="row">
          {props.topics.map((topic, i) => (
            <div className="col-xs-6" key={['topic', i].join('_')}>
              <TopicCard topic={topic} entity="street" id={props.location.query.id} label={props.location.query.label} search={props.location.query.search} />
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

Street.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  topics: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  iconLinksData: PropTypes.shape(iconLinksDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
};

// TODO - this is temporary dummy data
Street.defaultProps = {
  streetName: 'Montford Ave, 28801',
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
      'home',
      'road',
    ],
    labels: ['Addresses',
      'Resident mailing addresses',
      'Property owner addresses',
      'Property owner mailing addresses',
      'Properties',
      'Maintenance',
    ],
    hrefs: [
      '/address/addressList?entity=street&id=1234&label=Montford Ave, 28801&type=addresses',
      '/address/addressList?entity=street&id=1234&label=Montford Ave, 28801&type=residentMailing',
      '/address/addressList?entity=street&id=1234&label=Montford Ave, 28801&type=ownerAddresses',
      '/address/addressList?entity=street&id=1234&label=Montford Ave, 28801&type=ownerMailing',
      '/property/properties?entity=street&id=1234&label=Montford Ave, 28801',
      '/maintenance?entity=street&id=1234&label=Montford Ave, 28801',
    ],
  },
};

export default Street;
