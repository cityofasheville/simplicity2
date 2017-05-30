import React from 'react';
import PropTypes from 'prop-types';
import DetailsIconLinkGrouping from '../../shared/DetailsIconLinkGrouping';
import TopicCard from '../../shared/TopicCard';

const Street = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.location.query.label}</h1>
        <h3>About this street</h3>
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
              <TopicCard topic={topic} entity="street" id={props.location.query.id} label={props.location.query.label} />
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
