import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { combinePolygonsFromNeighborhoodList } from '../../utilities/mapUtilities';
import MapCopy from '../../shared/visualization/MapCopy';
import LoadingAnimation from '../../shared/LoadingAnimation';

const GET_NEIGHBORHOODS = gql`
  query getNeighborhoodsQuery {
    neighborhoods {
      name
      nbhd_id
      abbreviation
      narrative
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

function ProjectsMap({
  permitData,
  centerCoords,
  zoom,
  eventHandlers,
  showNeighborhoods,
}) {
  if (true) {
    return (<MapCopy
      data={permitData}
      center={centerCoords}
      height="100%"
      width="100%"
      zoom={zoom}
      eventHandlers={eventHandlers}
    />);
  }
  return (
    <Query
      query={GET_NEIGHBORHOODS}
    >
      {({ loading, error, data }) => {
        if (loading) return <LoadingAnimation />;
        if (error || data.neighborhoods.length === 0) {
          console.log(error);
          return <div>Error :( </div>;
        }
        return (<Map
          data={permitData}
          center={centerCoords}
          height="100%"
          width="100%"
          zoom={zoom}
          drawPolygon
          polygonData={combinePolygonsFromNeighborhoodList(data.neighborhoods)}
        />);
      }}
    </Query>
  );
};

ProjectsMap.propTypes = {
  permitData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  centerCoords: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number,
  showNeighborhoods: PropTypes.bool,
};

ProjectsMap.defaultProps = {
  zoom: 12,
  showNeighborhoods: false,
};

export default ProjectsMap;
