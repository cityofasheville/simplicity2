import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { combinePolygonsFromNeighborhoodList } from '../../../utilities/mapUtilities';
import Map from '../../../shared/visualization/Map';
import LoadingAnimation from '../../../shared/LoadingAnimation';

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

const PermitMap = ({
  permitData,
  centerCoords,
  zoom,
  showNeighborhoods = false,
}) => {
  if (!showNeighborhoods) {
    return (<Map
      data={permitData}
      center={centerCoords}
      height="100%"
      width="100%"
      zoom={14}
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
          zoom={14}
          drawPolygon
          polygonData={combinePolygonsFromNeighborhoodList(data.neighborhoods)}
        />);
      }}
    </Query>
  );
};

export default PermitMap;
