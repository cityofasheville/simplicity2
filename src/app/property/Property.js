import React from 'react';
import PropTypes from 'prop-types';
import DetailsTable from '../../shared/DetailsTable';
import DetailsGrouping from '../../shared/DetailsGrouping';
import DetailsIconLinkGrouping from '../../shared/DetailsIconLinkGrouping';

const renderZoning = propertyZoning => (
  <div className="form-group">
    <div style={{ fontWeight: 'bold' }}>Zoning</div>
    <div style={{ marginLeft: '15px' }}>
      {propertyZoning.map((types, i) => (
        <a key={['zoning', i].join('_')} href={types.href} target={'_blank'} title={types.type}>{types.type}{i < propertyZoning.length - 1 && <span>,</span>} </a>
      ))}
    </div>
  </div>
);

const Property = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.location.query.label}</h1>
        <h2>{props.propertyAddress}</h2>
        <h3>About this property</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsGrouping dataLabels={Object.keys(props.propertyDetails)} dataValues={Object.values(props.propertyDetails)} colWidth={6} />
          <div className="col-xs-6">
            {renderZoning(props.propertyZoning)}
          </div>
          <div className="row">
            <div className="col-xs-12">
              <DetailsIconLinkGrouping dataLabels={props.iconLinksData.labels} dataTitles={props.iconLinksData.labels} dataHrefs={props.iconLinksData.hrefs} dataIcons={props.iconLinksData.icons} colWidth={6} />
            </div>
          </div>
        </fieldset>
      </div>
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsTable hasTitle hasTitleIcon title={'Property and tax value'} titleIcon={'usd'} columns={props.tableColumns} data={props.tableData} />
        </fieldset>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsGrouping hasTitle hasTitleIcon title={'Owner'} titleIcon={'user'} dataValues={props.ownerData} />
        </fieldset>
      </div>
    </div>
  </div>
);

const propertyDataShape = {
  'Civic address ID': PropTypes.string,
  Neighborhood: PropTypes.string,
  'Tax exempt': PropTypes.string,
  'Pin #': PropTypes.string,
  'Appraisal area': PropTypes.string,
  Acreage: PropTypes.string,
  'Zoning overlay': PropTypes.string,
};

const iconLinksDataShape = {
  icons: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  labels: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  hrefs: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

Property.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  propertyAddress: PropTypes.string,
  propertyDetails: PropTypes.shape(propertyDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
  ownerData: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  tableColumns: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  tableData: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  propertyZoning: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  iconLinksData: PropTypes.shape(iconLinksDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
};

// TODO - this is temporary dummy data
Property.defaultProps = {
  propertyName: '450 MONTFORD AVE Unit',
  propertyAddress: 'Address of the Property 28123',
  propertyZoning: [
    { type: 'OFFICE', href: 'https://www.municode.com/library/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSDI_S7-8-18CEBUDI' },
    { type: 'RSA', href: 'https://www.municode.com/library/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSDI_S7-8-18CEBUDI' },
  ],
  propertyDetails: {
    'Civic address ID': '19973',
    Neighborhood: 'Montford',
    'Appraisal area': '1',
    'Tax exempt': 'NO',
    'Pin #': '123456778990099',
    Acreage: '1.05999999999999994',
    'Zoning overlay': 'MONTFORD_HISTORIC DISTRICTS',
  },
  ownerData: ['JEAN CHEECKS JETER HEIRS 63 WESTOVER DR'],
  iconLinksData: {
    icons: [
      'id-card',
      'book',
      'location-arrow',
      'google',
    ],
    labels: ['Deed',
      'Property card',
      'Plat',
      'Google map directions',
    ],
    hrefs: [
      'http://registerofdeeds.buncombecounty.org/external/LandRecords/protected/SrchBookPage.aspx?bAutoSearch=true&bk=1118&pg=0239&idx=DEE',
      'http://www.buncombetax.org/PropertyCard.aspx',
      'http://registerofdeeds.buncombecounty.org/external/LandRecords/protected/SrchBookPage.aspx?bAutoSearch=true&bk=0132&pg=0154&idx=ALL',
      'https://www.google.com/maps?daddr=35.5955276076747,-82.5484059079659',
    ],
  },
  tableColumns: [
    {
      Header: 'Value Type',
      accessor: 'value_type',
    },
    {
      Header: 'Amount',
      accessor: 'amount',
    },
  ],
  tableData: [
    { value_type: 'Building value', amount: '$682,100' },
    { value_type: 'Land value', amount: '$145,400' },
    { value_type: 'Appraised value', amount: '$827,500' },
    { value_type: 'Tax value', amount: '$0' },
    { value_type: 'Total market value', amount: '$827,500' },
  ],
};

export default Property;
