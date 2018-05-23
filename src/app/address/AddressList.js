import React from 'react';
import PropTypes from 'prop-types';
import AddressesByStreet from './AddressesByStreet';
import AddressesByNeighborhood from './AddressesByNeighborhood';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import Icon from '../../shared/Icon';
import { IM_ENVELOP3 } from '../../shared/iconConstants';
import { refreshLocation } from '../../utilities/generalUtilities';

const AddressList = (props) => {
  const getNewUrlParams = view => (
    {
      view,
    }
  );

  return (
    <div>
      <PageHeader h1={props.location.query.label} h3="Address & Owner Mailing Lists" icon={<Icon path={IM_ENVELOP3} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname={props.location.query.entity === 'neighborhood' ? '/neighborhood' : '/street'} query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar, entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label }}>Back to {props.location.query.entity}</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <ButtonGroup alignment="right">
            <Button onClick={() => refreshLocation(getNewUrlParams('list'), props.location)} active={props.location.query.view !== 'map'} positionInGroup="left">List view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('map'), props.location)} active={props.location.query.view === 'map'} positionInGroup="right">Map view</Button>
          </ButtonGroup>
        </div>
      </div>
      {props.location.query.entity === 'street' ?
        <AddressesByStreet {...props} />
        :
        <AddressesByNeighborhood {...props} />
      }
    </div>
  );
};

AddressList.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default AddressList;
