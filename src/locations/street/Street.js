import React from 'react';
import DetailsIconLinkGrouping from '../../components/DetailsIconLinkGrouping';
import TopicCard from '../../components/TopicCard';

const Street = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.streetName}</h1>
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
            <div className="col-xs-6">
              <TopicCard key={['topic', i].join('_')} topic={topic} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const iconLinksDataShape = {
  icons: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  labels: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  hrefs: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

Street.propTypes = {
  streetName: React.PropTypes.string,
  topics: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  iconLinksData: React.PropTypes.shape(iconLinksDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
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
      'http://www.ashevillenc.gov',
      'http://www.ashevillenc.gov',
      'http://www.ashevillenc.gov',
      'http://www.ashevillenc.gov',
      'http://www.ashevillenc.gov',
      'http://www.ashevillenc.gov',
    ],
  },
};

export default Street;
