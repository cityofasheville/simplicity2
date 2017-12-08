import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import EmailDownload from '../../shared/EmailDownload';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import PropertyList from './PropertyList';
import PropertiesByStreet from './PropertiesByStreet';
import Icon from '../../shared/Icon';
import { IM_HOME2 } from '../../shared/iconConstants';


const testFunc = (props) => {
  console.log(props);
};

const testPropertyData = [
  {
    PropertyName: '99999 BENNETT RD Unit',
    CivicAddressID: '91291231',
    PIN: '8695992975000000',
  },
  {
    PropertyName: '333 HAZEL MILL RD Unit',
    CivicAddressID: '21066',
    PIN: '9638904490000000',
  },
];

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

const Properties = props => {
  const refreshLocation = (view) => {
    browserHistory.push([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar, '&view=', view, '&search=', props.location.query.search].join(''));
  };

  return (
    <div>
      <PageHeader h1={props.location.query.label} h3={getSubtitle(props.location.query.entity)} icon={<Icon path={IM_HOME2} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname="/street" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar, entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label }}>Back to street</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <div className="pull-left">
            <EmailDownload emailFunction={testFunc} downloadFunction={testFunc} args={props.location.query} />
          </div>
          <ButtonGroup>
            <Button onClick={() => refreshLocation('list')} active={props.location.query.view !== 'map'} positionInGroup="left">List view</Button>
            <Button onClick={() => refreshLocation('map')} active={props.location.query.view === 'map'} positionInGroup="right">Map view</Button>
          </ButtonGroup>
        </div>
      </div>
      {props.location.query.entity === 'street' ?
        <PropertiesByStreet {...props} />
        :
        <PropertyList listData={testPropertyData} />
      }
    </div>
  );
};

Properties.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default Properties;
