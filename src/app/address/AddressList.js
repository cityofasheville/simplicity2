import React from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import AddressesByStreet from './AddressesByStreet';
import EmailDownload from '../../shared/EmailDownload';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';

const testFunc = (props) => {
  console.log(props);
};

const AddressList = props => {
  const refreshLocation = (view) => {
    browserHistory.push([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar, '&view=', view, '&search=', props.location.query.search].join(''));
  };

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h1><button className="btn btn-primary pull-right">Back</button>{props.location.query.label}</h1>
          <h3>Address &amp; Owner Mailing Lists</h3>
          <div className="pull-left">
            <EmailDownload emailFunction={testFunc} downloadFunction={testFunc} args={props.location.query} />
          </div>
          <ButtonGroup>
            <Button onClick={() => refreshLocation('list')} active={props.location.query.view !== 'map'} positionInGroup="left">List view</Button>
            <Button onClick={() => refreshLocation('map')} active={props.location.query.view === 'map'} positionInGroup="right">Map view</Button>
          </ButtonGroup>
        </div>
      </div>
      <AddressesByStreet {...props} />
    </div>
  );
};

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
