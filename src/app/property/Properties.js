import React from 'react';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import PropertiesByStreet from './PropertiesByStreet';
import PropertiesByNeighborhood from './PropertiesByNeighborhood';
import Icon from '../../shared/Icon';
import { IM_HOME2 } from '../../shared/iconConstants';
import { refreshLocation } from '../../utilities/generalUtilities';

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
  const getNewUrlParams = view => (
    {
      view,
    }
  );

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
            <Button onClick={() => refreshLocation(getNewUrlParams('map'), props.location)} active={props.location.query.view !== 'list'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('list'), props.location)} active={props.location.query.view === 'list'} positionInGroup="right">List view</Button>
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
