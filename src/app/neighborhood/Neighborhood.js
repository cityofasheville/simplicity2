import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import DetailsIconLinkFormGroup from '../../shared/DetailsIconLinkFormGroup';
import TopicCard from '../../shared/TopicCard';
import Icon from '../../shared/Icon';
import Map from '../../shared/visualization/Map';
import { IM_ENVELOP3, IM_USERS, IM_HOME2 } from '../../shared/iconConstants';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import { getBoundsFromPolygonData, combinePolygonsFromNeighborhoodList } from '../../utilities/mapUtilities';

const Neighborhood = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  return (
    <div>
      <PageHeader h1={props.location.query.label} dataType="Neighborhood" h3="About this neighborhood" icon={<Icon path={IM_USERS} size={50} />}>
        <ButtonGroup alignment="">
          <LinkButton pathname="/search" query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back to search</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row small-padding">
        <div className="col-sm-7">
          <fieldset className="detailsFieldset">
            <div className="map-container">
              <Map
                drawPolygon
                polygonData={combinePolygonsFromNeighborhoodList([props.data.neighborhoods[0]])}
                bounds={getBoundsFromPolygonData([props.data.neighborhoods[0].polygon])}
              />
            </div>
            <div className="detailsFieldset__details-listings">
              <DetailsIconLinkFormGroup label="Address & Owner Mailing Lists" icon={<Icon path={IM_ENVELOP3} size={24} />} href={['address/addressList', '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&entities=', props.location.query.entities, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Address & Owner Mailing Lists" inWindow />
              <DetailsIconLinkFormGroup label="Properties" icon={<Icon path={IM_HOME2} size={24} />} href={['property/properties', '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&entities=', props.location.query.entities, '&label=', props.location.query.label, '&search=', props.location.query.search, '&hideNavbar=', props.location.query.hideNavbar].join('')} title="Properties" inWindow />
            </div>            
          </fieldset>
        </div>
        <div className="col-sm-5">
          <div className="row small-padding">
            {['CRIME', 'DEVELOPMENT'].map((topic, i) => (
              <div className="col-xs-6" key={['topic', i].join('_')}>
                <TopicCard topic={topic} entity="neighborhood" id={props.location.query.id} label={props.location.query.label} entities={props.location.query.entities} search={props.location.query.search} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getNeighborhoodQuery = gql`
  query getNeighborhood($nbrhd_ids: [String]) {
    neighborhoods (nbrhd_ids: $nbrhd_ids) {
      name
      polygon {
        outer {
          points {
            x
            y
          }
        }
        holes {
          points {
            x
            y
          }
        }
      }
    } 
  }
`;

const NeighborhoodQGL = graphql(getNeighborhoodQuery, {
  options: ownProps => ({
    variables: {
      nbrhd_ids: [ownProps.location.query.id.trim()],
    },
  }),
})(Neighborhood);

export default NeighborhoodQGL;
