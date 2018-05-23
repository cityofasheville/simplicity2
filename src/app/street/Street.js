import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import DetailsIconLinkFormGroup from '../../shared/DetailsIconLinkFormGroup';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import Map from '../../shared/visualization/Map';
import { getBoundsFromStreetData, formatMaintenanceData, createMaintenanceLegend } from '../../utilities/mapUtilities';
import TopicCard from '../../shared/TopicCard';
import Icon from '../../shared/Icon';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import { IM_ENVELOP3, IM_ROAD, IM_HOME2, IM_TRAFFIC_CONE } from '../../shared/iconConstants';

const Street = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  return (
    <div>
      <PageHeader h1={props.location.query.label} dataType="Street" h3="About this street" icon={<Icon path={IM_ROAD} size={50} />}>
        <ButtonGroup>
          <LinkButton pathname="/search" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back to search</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-6">
          <fieldset className="detailsFieldset">
            <div className="map-container">
              <Map height="250px" legend={createMaintenanceLegend(formatMaintenanceData(props.data.streets))} maintenanceData={formatMaintenanceData(props.data.streets)} drawMaintenance bounds={props.location.query.bounds !== undefined & props.location.query.bounds !== '' ? JSON.parse(props.location.query.bounds) : getBoundsFromStreetData(props.data.streets)} />
            </div>
            <div className="detailsFieldset__details-listings">
              <DetailsIconLinkFormGroup label="Address & Owner Mailing Lists" icon={<Icon path={IM_ENVELOP3} size={24} />} href={['address/addressList', '?entity=', props.location.query.entity, '&entities=', props.location.query.entities, '&id=', props.location.query.id, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Address & Owner Mailing Lists" inWindow />
              <DetailsIconLinkFormGroup label="Properties" icon={<Icon path={IM_HOME2} size={24} />} href={['property/properties', '?entity=', props.location.query.entity, '&entities=', props.location.query.entities, '&id=', props.location.query.id, '&search=', props.location.query.search, '&label=', props.location.query.label, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Properties" inWindow />
              <DetailsIconLinkFormGroup label="Maintenance" icon={<Icon path={IM_TRAFFIC_CONE} size={24} />} href={['maintenance', '?entity=', props.location.query.entity, '&entities=', props.location.query.entities, '&search=', props.location.query.search, '&id=', props.location.query.id, '&label=', props.location.query.label, '&hideNavbar=', props.location.query.hideNavbar, '&view=map'].join('')} title="Maintenance" inWindow />
            </div>
          </fieldset>
        </div>
        <div className="col-sm-6">
          <div className="row">
            {props.topics.map((topic, i) => (
              <div className="col-xs-6" key={['topic', i].join('_')}>
                <TopicCard topic={topic} entity="street" id={props.location.query.id} label={props.location.query.label} search={props.location.query.search} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO - this is temporary dummy data
Street.defaultProps = {
  topics: [
    'CRIME',
    'DEVELOPMENT',
  ],
};

const getMaintenanceQuery = gql`
  query getMaintenanceQuery($centerline_ids: [Float]) {
    streets (centerline_ids: $centerline_ids) {
      centerline_id
        left_zipcode
        right_zipcode
        maintenance_entities
        line {
          x
          y
        }
    }    
  }
`;

const StreetGQL = graphql(getMaintenanceQuery, {
  options: ownProps => ({
    variables: {
      centerline_ids: ownProps.location.query.id.trim().split(','),
    },
  }),
})(Street);

export default StreetGQL;
