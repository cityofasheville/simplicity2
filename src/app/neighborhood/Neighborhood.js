import React from 'react';
import PropTypes from 'prop-types';
import DetailsIconLinkGrouping from '../../shared/DetailsIconLinkGrouping';
import TopicCard from '../../shared/TopicCard';

const Neighborhood = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.location.query.label}</h1>
        <h3>About this neighborhood</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsIconLinkGrouping dataLabels={props.iconLinksData.labels} dataTitles={props.iconLinksData.labels} dataHrefs={props.iconLinksData.hrefs} dataIcons={props.iconLinksData.icons} colWidth={12} />
        </fieldset>
      </div>
      <div className="col-sm-6">
        <div className="row">
          {props.topics.map((topic, i) => (
            <div className="col-xs-6" key={['topic', i].join('_')}>
              <TopicCard topic={topic} entity="neighborhood" id={props.location.query.id} label={props.location.query.label} />
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
