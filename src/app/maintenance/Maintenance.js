import React from 'react';
import { browserHistory } from 'react-router';
import MaintenanceByStreet from './MaintenanceByStreet';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import Icon from '../../shared/Icon';
import { IM_TRAFFIC_CONE } from '../../shared/iconConstants';

const testFunc = (props) => {
  console.log(props);
};

const getSubtitle = (entity) => {
  switch (entity) {
    case 'street':
      return 'Maintenance along this street';
    default:
      return 'Maintenance';
  }
};

const Maintenance = props => {
  const refreshLocation = (view) => {
    browserHistory.push([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar, '&view=', view].join(''));
  };

  return (
    <div>
      <PageHeader h1={props.location.query.label} h3={getSubtitle(props.location.query.entity)} icon={<Icon path={IM_TRAFFIC_CONE} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname="/street" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar, entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label }}>Back to {props.location.query.entity}</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <ButtonGroup>
            <Button onClick={() => refreshLocation('map')} active={props.location.query.view === 'map'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation('list')} active={props.location.query.view !== 'map'} positionInGroup="right">List view</Button>
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
