import React from 'react';
import PropTypes from 'prop-types';
import EmailDownload from '../../shared/EmailDownload';
import styles from './addressList.css';

const testFunc = (props) => {
  console.log(props);
};

const renderSubTitle = (entity, type) => {
  switch (type) {
    case 'addresses':
      if (entity === 'street') {
        return (<h3>Addresses along this street</h3>);
      }
      return (<h3>Addresses in this neighborhood</h3>);
    case 'residentMailing':
      if (entity === 'street') {
        return (<h3>Resident mailing addresses along this street</h3>);
      }
      return (<h3>Resident mailing addresses in this neighborhood</h3>);
    case 'ownerAddresses':
      if (entity === 'street') {
        return (<h3>Property owner addresses along this street</h3>);
      }
      return (<h3>Property owner addresses in this neighborhood</h3>);
    case 'ownerMailing':
      if (entity === 'street') {
        return (<h3>Property owner mailing addresses along this street</h3>);
      }
      return (<h3>Property owner mailing addresses in this neighborhood</h3>);
    default:
      return (<div></div>);
  }
};

const AddressList = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.location.query.label}</h1>
        {renderSubTitle(props.location.query.entity, props.location.query.type)}
        <div className="pull-left">
          <EmailDownload emailFunction={testFunc} downloadFunction={testFunc} args={props.location.query} />
        </div>
        <div className="btn-group pull-right" style={{ marginTop: '5px' }}>
          <button className="btn btn-primary active">List view</button>
          <button className="btn btn-primary">Map view</button>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <fieldset className="detailsFieldset" style={{ marginTop: '10px' }}>
          {props.listData.map((item, i) => (
            <div className={['form-group', styles.addressListItem].join(' ')} key={['addressListItem', i].join('_')}>
              {item.name !== '' &&
                <div>
                  {item.name}
                </div>
              }
              <div>
                {item.address}
              </div>
            </div>
          ))}
        </fieldset>
      </div>
    </div>
  </div>
);

const addressDataShape = {
  name: PropTypes.string,
  address: PropTypes.string,
};

AddressList.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  listData: PropTypes.arrayOf(PropTypes.shape(addressDataShape)),
};

// TODO - this is temporary dummy data
AddressList.defaultProps = {
  location: {
    query: { label: 'Montford', entity: 'neighborhood', type: 'addresses', id: '1234' },
  },
  listData: [
    {
      address: '1234 South Main Street, 28801',
    },
    {
      name: 'John Doe',
      address: '1234 South Main Street, 28801',
    },
  ],
};

export default AddressList;
