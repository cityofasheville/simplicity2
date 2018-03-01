import React from 'react';
import { browserHistory } from 'react-router';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import PropertiesByStreet from './PropertiesByStreet';
import PropertiesByNeighborhood from './PropertiesByNeighborhood';
import Icon from '../../shared/Icon';
import { IM_HOME2 } from '../../shared/iconConstants';

const getSubtitle = (entity) => {
  switch (entity) {
    case 'street':
      return 'Properties along this street';
    case 'neighborhood':
      return 'Properties in this neighborhood';
    default:
      return 'Properties';
  }
};

const Properties = (props) => {
  const refreshLocation = (view) => {
    browserHistory.replace([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&entities=', props.location.query.entities, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar, '&view=', view].join(''));
  };

  return (
    <div>
      <PageHeader h1={props.location.query.label} h3={getSubtitle(props.location.query.entity)} icon={<Icon path={IM_HOME2} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname={props.location.query.entity === 'neighborhood' ? '/neighborhood' : '/street'} query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar, entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label }}>Back to {props.location.query.entity}</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <ButtonGroup>
            <Button onClick={() => refreshLocation('map')} active={props.location.query.view !== 'list'} positionInGroup="right">Map view</Button>
            <Button onClick={() => refreshLocation('list')} active={props.location.query.view === 'list'} positionInGroup="left">List view</Button>
          </ButtonGroup>
        </div>
      </div>
      {props.location.query.entity === 'street' ?
        <PropertiesByStreet {...props} />
      :
        <PropertiesByNeighborhood {...props} />
      }
    </div>
  );
};

export default Properties;
