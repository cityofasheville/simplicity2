import React from 'react';
import MaintenanceByStreet from './MaintenanceByStreet';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import Icon from '../../shared/Icon';
import { IM_TRAFFIC_CONE } from '../../shared/iconConstants';
import { refreshLocation } from '../../utilities/generalUtilities';

const getSubtitle = (entity) => {
  switch (entity) {
    case 'street':
      return 'Maintenance along this street';
    default:
      return 'Maintenance';
  }
};

const Maintenance = (props) => {
  const getNewUrlParams = view => (
    {
      view,
    }
  );

  return (
    <div>
      <PageHeader h1={props.location.query.label} h2={getSubtitle(props.location.query.entity)} icon={<Icon path={IM_TRAFFIC_CONE} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname="/street" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar, entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label }}>Back to {props.location.query.entity}</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <ButtonGroup alignment="right">
            <Button onClick={() => refreshLocation(getNewUrlParams('map'), props.location)} active={props.location.query.view !== 'list'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('list'), props.location)} active={props.location.query.view === 'list'} positionInGroup="right">List view</Button>
          </ButtonGroup>
        </div>
      </div>
      {props.location.query.entity === 'street' ?
        <MaintenanceByStreet {...props} />
      :
        <span>No information available</span>
      }
    </div>
  );
};

export default Maintenance;
