import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { Link } from 'react-router';
import Icon from '../../shared/Icon';
import Map from '../../shared/visualization/Map';
import { IM_USERS } from '../../shared/iconConstants';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import PageHeader from '../../shared/PageHeader';
import { getBoundsFromPolygonData, combinePolygonsFromNeighborhoodList } from '../../utilities/mapUtilities';
// import { english } from './english';
// import { spanish } from './spanish';

const BlockGroup = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }
  // // set language
  // let content;
  // switch (props.language.language) {
  //   case 'Spanish':
  //     content = spanish;
  //     break;
  //   default:
  //     content = english;
  // }
  return (
    <div>
      <PageHeader h1={props.data.blockgroups[0].name} dataType="Census Block Group" h2="About this Block Group" icon={<Icon path={IM_USERS} size={50} />}>
        <ButtonGroup alignment="">
          <LinkButton
            pathname="/address"
            query={{
              id: props.location.query.fromAddress, entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar,
              entity: "address", label: props.location.query.label
            }
            }
          >
            Back to address
          </LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row small-padding">
        <div className="col-sm-7">
          <fieldset className="detailsFieldset">
            <div className="map-container">
              <Map
                drawPolygon
                polygonData={combinePolygonsFromNeighborhoodList([props.data.blockgroups[0]])}
                bounds={getBoundsFromPolygonData([props.data.blockgroups[0].polygon])}
              />
            </div>
          </fieldset>
        </div>
        <div className="col-sm-4">
          <div className="row small-padding">
            <table>
              <thead><th colSpan="2">Climate Justice Data for this Block Group</th></thead>
              <tr><td>below_pov</td><td>{props.data.blockgroups[0].below_pov}</td></tr>
              <tr><td>bipoc</td><td>{props.data.blockgroups[0].bipoc}</td></tr>
              <tr><td>totalhh</td><td>{props.data.blockgroups[0].totalhh}</td></tr>
              <tr><td>school_chi</td><td>{props.data.blockgroups[0].school_chi}</td></tr>
              <tr><td>bipoc_score</td><td>{props.data.blockgroups[0].bipoc_score}</td></tr>
              <tr><td>poverty_sc</td><td>{props.data.blockgroups[0].poverty_sc}</td></tr>
              <tr><td>acres</td><td>{props.data.blockgroups[0].acres}</td></tr>
              <tr><td>hvi_value</td><td>{props.data.blockgroups[0].hvi_value}</td></tr>
              <tr><td>heat_score</td><td>{props.data.blockgroups[0].heat_score}</td></tr>
              <tr><td>rpl_themes</td><td>{props.data.blockgroups[0].rpl_themes}</td></tr>
              <tr><td>cdc_score</td><td>{props.data.blockgroups[0].cdc_score}</td></tr>
              <tr><td>avg_energy</td><td>{props.data.blockgroups[0].avg_energy}</td></tr>
              <tr><td>hh_energy_</td><td>{props.data.blockgroups[0].hh_energy_}</td></tr>
              <tr><td>pct_hh_ene</td><td>{props.data.blockgroups[0].pct_hh_ene}</td></tr>
              <tr><td>energy_sco</td><td>{props.data.blockgroups[0].energy_sco}</td></tr>
              <tr><td>resland</td><td>{props.data.blockgroups[0].resland}</td></tr>
              <tr><td>resflood</td><td>{props.data.blockgroups[0].resflood}</td></tr>
              <tr><td>critland</td><td>{props.data.blockgroups[0].critland}</td></tr>
              <tr><td>critflood</td><td>{props.data.blockgroups[0].critflood}</td></tr>
              <tr><td>comflood</td><td>{props.data.blockgroups[0].comflood}</td></tr>
              <tr><td>shape__len</td><td>{props.data.blockgroups[0].shape__len}</td></tr>
              <tr><td>shape__are</td><td>{props.data.blockgroups[0].shape__are}</td></tr>
              <tr><td>nemacscore</td><td>{props.data.blockgroups[0].nemacscore}</td></tr>
              <tr><td>resiliency</td><td>{props.data.blockgroups[0].resiliency}</td></tr>
              <tr><td>cj_score</td><td>{props.data.blockgroups[0].cj_score}</td></tr>
              <tr><td>sum_scores</td><td>{props.data.blockgroups[0].sum_scores}</td></tr>
              <tr><td>holc</td><td>{props.data.blockgroups[0].holc}</td></tr>
              <tr><td>red_score</td><td>{props.data.blockgroups[0].red_score}</td></tr>
              <tr><td>wfirescore</td><td>{props.data.blockgroups[0].wfirescore}</td></tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const getBlockGroupQuery = gql`
  query getBlockGroup($geoid: [String]) {
    blockgroups (geoid: $geoid) {
      geoid
      name
      below_pov
      bipoc
      totalhh
      school_chi
      bipoc_score
      poverty_sc
      acres
      hvi_value
      heat_score
      rpl_themes
      cdc_score
      avg_energy
      hh_energy_
      pct_hh_ene
      energy_sco
      resland
      resflood
      critland
      critflood
      comflood
      shape__len
      shape__are
      nemacscore
      resiliency
      cj_score
      sum_scores
      holc
      red_score
      wfirescore
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

const BlockGroupQGL = graphql(getBlockGroupQuery, {
  options: ownProps => ({
    variables: {
      geoid: [ownProps.location.query.id.trim()],
    },
  }),
})(BlockGroup);

export default BlockGroupQGL;
