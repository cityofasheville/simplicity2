import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import DetailsGrouping from '../../shared/DetailsGrouping';
import DetailsIconLinkGrouping from '../../shared/DetailsIconLinkGrouping';
import TopicCard from '../../shared/TopicCard';
import InCityMessage from '../InCityMessage';

const testZoning = [{ type: 'OFFICE', href: 'https://www.municode.com/library/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSDI_S7-8-18CEBUDI' },
{ type: 'RSA', href: 'https://www.municode.com/library/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSDI_S7-8-18CEBUDI' }];

const renderZoning = (zoning = testZoning) => (
  // TODO: get zoning via query...
  <div className="form-group">
    <div style={{ fontWeight: 'bold' }}>Zoning</div>
    <div style={{ marginLeft: '15px' }}>
      {zoning.map((types, i) => (
        <a key={['zoning', i].join('_')} target={'_blank'} href={types.href} title={types.type}>{types.type}{i < zoning.length - 1 && <span>,</span>} </a>
      ))}
    </div>
  </div>
);

const calculateRecycling = (dayOfWeek, city) => {
  switch (city) {
    case 'ASHE':
      // TODO calculation for this week or next week and the recycle week letter
      return ['(this or next week?) on', dayOfWeek, '(Recycle Week ??)'].join(' ');
    default:
      return 'No recycling collection information available';
  }
};

const calculateTrash = (dayOfWeek, city) => {
  switch (city) {
    case 'ASHE':
      return ['every', dayOfWeek].join(' ');
    default:
      return 'No trash collection information available';
  }
};

const Address = (props) => {
  if (props.data.loading) {
    return <p>Loading...</p>;
  }
  if (props.data.error) {
    return <p>{props.data.error.message}</p>;
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h1><button className="btn btn-primary pull-right">Back</button>{props.data.mda_address.address}, {props.data.mda_address.zipcode}</h1>
          <h3>About this address</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <fieldset className="detailsFieldset">
            <InCityMessage inTheCity={props.data.mda_address.city === 'ASHE'} />
            <hr style={{ marginTop: '10px', marginBottom: '10px' }} />
            <DetailsGrouping dataLabels={['Trash collection', 'Recycling collection']} dataValues={[calculateTrash(props.data.mda_address.truckday, props.data.mda_address.city), calculateRecycling(props.data.mda_address.truckday, props.data.mda_address.city)]} dataIcons={['trash', 'recycle']} />
            <div className="col-xs-12">
              {renderZoning()}
            </div>
            <DetailsGrouping dataLabels={['Owner']} dataValues={['TEST OWNER NAME and test owner address']} dataIcons={['user']} />
            <DetailsIconLinkGrouping dataLabels={['Property', 'Maintenance']} dataTitles={['Property', 'Maintenance']} dataHrefs={['/locations/property/properties', '/maintenance?entity=address']} dataIcons={['home', 'road']} />
          </fieldset>
        </div>
        <div className="col-sm-6">
          <div className="row">
            {['CRIME', 'DEVELOPMENT'].map((topic, i) => (
              <div className="col-xs-6" key={['topic', i]}>
                <TopicCard topic={topic} entity="address" id={props.location.query.id} label={props.location.query.label} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const dataShape = {
  address: React.PropTypes.string,
  zipcode: React.PropTypes.string,
  city: React.PropTypes.string,
  truckday: React.PropTypes.string,
};

Address.propTypes = {
  data: React.PropTypes.shape(dataShape).isRequired,
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

Address.defaultProps = {
  data: {
    address: '450 MONTFORD AVE',
    zipcode: '28801',
    city: 'Asheville', //this should probably be changed to be an inTheCity boolean?
  },
};

const addressQuery = gql`
  query addressQuery($id: ID!) {
    mda_address(id: $id) {
      address
      zipcode
      city
      truckday
    }
  }
`;

const AddressWithData = graphql(addressQuery, {
  options: ownProps => ({ variables: { id: ownProps.location.query.id } }),
})(Address);

export default AddressWithData;
