import React from 'react';
import DetailsGrouping from '../../components/DetailsGrouping';
import DetailsIconLinkGrouping from '../../components/DetailsIconLinkGrouping';
import TopicCard from '../../components/TopicCard';
import InCityMessage from '../../components/InCityMessage';

const renderZoning = zoning => (
  <div className="form-group">
    <div style={{ 'font-weight': 'bold' }}>Zoning</div>
    <div style={{ 'margin-left': '15px' }}>
      {zoning.map((types, i) => (
        <a key={['zoning', i].join('_')} target={'_blank'} href={types.href} title={types.type}>{types.type}{i < zoning.length - 1 && <span>,</span>} </a>
      ))}
    </div>
  </div>
);

const Address = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.address}</h1>
        <h3>About this address</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <InCityMessage inTheCity={props.inTheCity} />
          <hr style={{ 'margin-top': '10px', 'margin-bottom': '10px' }} />
          <DetailsGrouping dataLabels={props.dataLabels.slice(0, 2)} dataValues={props.dataValues.slice(0, 2)} dataIcons={props.dataIcons.slice(0, 2)} />
          <div className="col-xs-12">
            {renderZoning(props.addressZoning)}
          </div>
          <DetailsGrouping dataLabels={props.dataLabels.slice(2)} dataValues={props.dataValues.slice(2)} dataIcons={props.dataIcons.slice(2)} />
          <DetailsIconLinkGrouping dataLabels={props.iconLinksData.labels} dataTitles={props.iconLinksData.labels} dataHrefs={props.iconLinksData.hrefs} dataIcons={props.iconLinksData.icons} />
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

Address.propTypes = {
  address: React.PropTypes.string,
  inTheCity: React.PropTypes.bool,
  addressZoning: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataLabels: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataValues: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataIcons: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  topics: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  iconLinksData: React.PropTypes.shape(iconLinksDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
};

// TODO - this is temporary dummy data
Address.defaultProps = {
  address: '450 MONTFORD AVE Unit',
  inTheCity: true,
  topics: [
    'CRIME',
    'DEVELOPMENT',
  ],
  addressZoning: [
    { type: 'OFFICE', href: 'https://www.municode.com/library/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSDI_S7-8-18CEBUDI' },
    { type: 'RSA', href: 'https://www.municode.com/library/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSDI_S7-8-18CEBUDI' },
  ],
  dataLabels: [
    'Trash collection',
    'Recycling collection',
    'Owner',
  ],
  dataValues: [
    'every Tuesday',
    'next week on Tuesday (Recycle Week A)',
    'JEAN CHEECKS JETER HEIRS 63 WESTOVER DR',
  ],
  dataIcons: [
    'trash',
    'recycle',
    'user',
  ],
  iconLinksData: {
    icons: [
      'home',
      'road',
    ],
    labels: ['Property',
      'Maintenance',
    ],
    hrefs: [
      'http://registerofdeeds.buncombecounty.org/external/LandRecords/protected/SrchBookPage.aspx?bAutoSearch=true&bk=1118&pg=0239&idx=DEE',
      'http://www.buncombetax.org/PropertyCard.aspx',
      'http://registerofdeeds.buncombecounty.org/external/LandRecords/protected/SrchBookPage.aspx?bAutoSearch=true&bk=0132&pg=0154&idx=ALL',
      'https://www.google.com/maps?daddr=35.5955276076747,-82.5484059079659',
    ],
  },
};

export default Address;
