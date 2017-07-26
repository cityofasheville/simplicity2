import React from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Icon from '../../shared/Icon';
import { IM_QUESTION, IM_MAP5, IM_SPHERE3, IM_CIRCLE2 } from '../../shared/iconConstants';

const getIcon = (category) => {
  switch(category) {
    default:
      return <Icon path={IM_QUESTION} size={30} />
  }
};

const getStageNumber = (stage) => {
  const newStage = stage.split(': ')[1];
  switch (stage) {
    case 'Planning':
      return 1;
    case 'Design':
      return 2;
    case 'Construction':
      return 3;
    case 'Completed':
      return 4;
    default:
      return 0;
  }
};

const phaseColor = (phaseNumber) => {
  switch (phaseNumber) {
    case 1:
      return '#f844ff';
    case 2:
      return '#44cdff';
    case 3:
      return '#FF5722';
    default:
      return '#57d500';
  }
};

const ProjectDetails = (props) => (
  <div className="row">
    <div className="col-sm-12">
      <div className="row" hidden={props.hideTitle}>
        <div className="col-sm-12">
          <h4>{getIcon()} {props['Project Name']}</h4>
        </div>
      </div>
      <div className="row" style={props.hideTitle ? { marginTop: '15px' } : null}>
        <div className="col-sm-7">
          <div className="row">
            <div className="col-sm-12" style={{ marginTop: '5px' }}>
              <div className="pull-left" style={{ marginRight: '10px', marginBottom: '20px' }}> <a title="View project in story map"><Icon path={IM_SPHERE3} size={20} /> Project Website</a></div>
              <div className="pull-left"> <a title="View project in story map"><Icon path={IM_MAP5} size={20} /> View in Story Map</a></div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="text-center" style={{ marginBottom: '10px' }}>
                <div className="text-primary">
                  <strong>Zip code</strong>
                </div>
                <div>
                  {props['Zip Code'] || '?'}
                </div>
              </div>
              <div className="text-center" style={{ marginBottom: '10px' }}>
                <div className="text-primary">
                  <strong>Total bond funding</strong>
                </div>
                <div>
                  {props['Total Project Funding (Budget Document)']}
                </div>
              </div>
            </div>
            <div className="col-xs-6">
              <div className="text-center" style={{ marginBottom: '10px' }}>
                <div className="text-primary">
                  <strong>Spent</strong>
                </div>
                <div>
                  {props['Total Spent'] || '$0'}
                </div>
              </div>         
              <div className="text-center" style={{ marginBottom: '20px' }}>
                <div className="text-primary">
                  <strong>Construction start</strong>
                </div>
                <div>
                  {props['Target Construction Start'] || '?'}
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="text-primary text-center" style={{ marginBottom: '5px' }}>
              <strong>Project phase</strong>
            </div>
            <div className="col-xs-2">
              <Icon path={IM_CIRCLE2} size={25} color={getStageNumber(props.Status) >= 1 ? phaseColor(1) : '#ecf0f1'} />
            </div>
            <div className="col-xs-2">
              <Icon path={IM_CIRCLE2} size={25}  color={getStageNumber(props.Status) >= 2 ? phaseColor(2) : '#ecf0f1'} />
            </div>
            <div className="col-xs-2">
              <Icon path={IM_CIRCLE2} size={25}  color={getStageNumber(props.Status) >= 3 ? phaseColor(3) : '#ecf0f1'} />
            </div>
            <div className="col-xs-2">
              <Icon path={IM_CIRCLE2} size={25} color={getStageNumber(props.Status) >= 4 ? phaseColor(4) : '#ecf0f1'} style={{ marginRight: '5px' }} />
            </div>
            <div className="col-xs-2" style={{ color: phaseColor(getStageNumber(props.Status)), fontWeight: 'bold' }}>
              {props.Status.split(': ')[1]}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12" style={{ marginTop: '20px', marginBottom: '10px' }}>
              {props['Project Description']}
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <Map center={[35.5951005, -82.5487476]} zoom={13} style={{ height: '230px', width: '100%', marginBottom: '15px' }}>
            {/*<WMSTileLayer     url="http://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/CIP_Storymap/FeatureServer"
            />*/}
            <TileLayer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              attribution="&copy: <a href='http://osm.org/copyright'>OpenStreetMap</a> constributors"
            />
            <Marker position={[35.5951005, -82.5487476,15]}>
              <Popup>
                <span>{props.name}</span>
              </Popup>
            </Marker>
          </Map>
          <a href={props['Photo URL']} target="_blank">
            <img className="img-responsive" src={props['Photo URL']} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

ProjectDetails.propTypes = {
  description: PropTypes.string,
  hideTitle: PropTypes.bool,
};

ProjectDetails.defaultProps = {
  description: "This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.",
  hideTitle: false,
};

export default ProjectDetails;