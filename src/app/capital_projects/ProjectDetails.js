import React from 'react';
import PropTypes from 'prop-types';
import Map from '../../shared/visualization/Map';
import { projectsGeoJSON } from './cip_utilities';
import Icon from '../../shared/Icon';
import { IM_QUESTION, IM_MAP5, IM_SPHERE3, IM_CIRCLE2, IM_CERTIFICATE } from '../../shared/iconConstants';

const getIcon = (category) => {
  switch (category) {
    default:
      return <Icon path={IM_QUESTION} size={30} />
  }
};

const getStageNumber = (stage) => {
  switch (stage) {
    case 'Status: Planning':
      return 1;
    case 'Status: Design':
      return 2;
    case 'Status: Construction':
      return 3;
    case 'Status: Completed':
      return 4;
    case 'Ongoing':
      return 5;
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

const getMyPoints = name => (
  projectsGeoJSON.features.filter(item => (item.properties.NAME === name)).map(item => (
    Object.assign({}, {}, { x: item.geometry.coordinates[0], y: item.geometry.coordinates[1], name: item.properties.NAME, popup: `<div><b>${item.properties.NAME}</b><p>Latitude: ${item.geometry.coordinates[1]}</p><p>Longitude: ${item.geometry.coordinates[0]}</p></div>` })
  ))
);

const calculateBounds = (points) => {
  let xMinIndex = 0;
  let yMinIndex = 0;
  let xMaxIndex = 0;
  let yMaxIndex = 0;
  if (points.length > 0) {
    for (let i = 0; i < points.length; i += 1) {
      if (points[i].x < points[xMinIndex].x) {
        xMinIndex = i;
      }
      if (points[i].x > points[xMaxIndex].x) {
        xMaxIndex = i;
      }
      if (points[i].y < points[yMinIndex].y) {
        yMinIndex = i;
      }
      if (points[i].y > points[yMaxIndex].y) {
        yMaxIndex = i;
      }
    }
    return [
      [points[yMinIndex].y, points[xMinIndex].x],
      [points[yMaxIndex].y, points[xMaxIndex].x],
    ];
  }
  return null;
};

const ProjectDetails = (props) => (
  <div className="row">
    <div className="col-sm-12">
      <div className="row" hidden={props.hideTitle}>
        <div className="col-sm-12">
          <h4>{getIcon()} {props.display_name}</h4>
        </div>
      </div>
      <div className="row" style={props.hideTitle ? { marginTop: '15px' } : null}>
        <div className="col-sm-7">
          {props.project_webpage_more_information !== null &&
            <div className="row">
              <div className="col-sm-12" style={{ marginTop: '5px' }}>
                <div className="pull-left" style={{ marginRight: '10px', marginBottom: '20px' }}> <a title="View project web site" href={props.project_webpage_more_information} target="_blank"><Icon path={IM_SPHERE3} size={20} /> Project Website</a></div>
              </div>
            </div>
          }
          <div className="row">
            <div className="col-xs-5">
              <div className="text-center" style={{ marginBottom: '10px' }}>
                <div style={{ color: '#676873' }}>
                  Current Project Budget
                </div>
                <div>
                  <strong>{props.total_project_funding_budget_document}</strong>
                </div>
              </div>
              {props.show_pm_fields &&
                <div className="text-center" style={{ marginBottom: '10px' }}>
                  <div style={{ color: '#676873' }}>
                    Spent
                  </div>
                  <div>
                    <strong>{['$', parseInt(props.total_spent).toLocaleString()].join('')}</strong>
                  </div>
                </div>         
              }
            </div>
            <div className="col-xs-7">
              <div className="text-center" style={{ marginBottom: '10px' }}>
                <div style={{ color: '#676873' }}>
                  Zip code
                </div>
                <div >
                  <strong>{props.zip_code || '?'}</strong>
                </div>
              </div>
              {props.show_pm_fields &&
                <div className="text-center" style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#676873' }}>
                    Estimated Construction Timeframe
                  </div>
                  <div>
                    <strong>{props.status !== null && props.status.indexOf('Completed') > -1 ? ['Completed', props.actual_construction_end].join(' ') : props.target_construction_start === null ? props.target_construction_end : [props.target_construction_start, props.target_construction_end].join(' - ')}</strong>
                  </div>
                </div>
              }
            </div>
          </div>
          {/*{props.Category.indexOf('Bond') > -1 &&
            <div className="row">
              <div className="col-sm-12">
                <Icon path={IM_CERTIFICATE} size={25} color="#4077a5" /> 
                <span>Bond funding: {props['GO Bond Funding']}</span>
              </div>
            </div>
          }*/}
          {props.show_pm_fields && props.status !== null &&
            <div className="row">
              <div className="text-center" style={{ marginBottom: '5px', color: '#676873' }}>
                Project phase
              </div>
              <div className={props.status === 'Ongoing' ? "col-xs-3" : "col-xs-2"}>
                <Icon path={IM_CIRCLE2} size={25} color={getStageNumber(props.status) >= 1 ? phaseColor(1) : '#ecf0f1'} />
              </div>
              <div className={props.status === 'Ongoing' ? "col-xs-3" : "col-xs-2"}>
                <Icon path={IM_CIRCLE2} size={25}  color={getStageNumber(props.status) >= 2 ? phaseColor(2) : '#ecf0f1'} />
              </div>
              <div className={props.status === 'Ongoing' ? "col-xs-3" : "col-xs-2"}>
                <Icon path={IM_CIRCLE2} size={25}  color={props.status === 'Ongoing' ? '#FFC107' : getStageNumber(props.status) >= 3 ? phaseColor(3) : '#ecf0f1'} />
              </div>
              {props.status !== 'Ongoing' &&
                <div className="col-xs-2">
                  <Icon path={IM_CIRCLE2} size={25} color={getStageNumber(props.status) >= 4 ? phaseColor(4) : '#ecf0f1'} style={{ marginRight: '5px' }} />
                </div>
              }
              <div className="col-xs-2" style={{ color: props.status === 'Ongoing' ? '#FFC107' : phaseColor(getStageNumber(props.status)), fontWeight: 'bold' }}>
                {props.status === 'Ongoing' ? props.status : props.status.split(': ')[1]}
              </div>
            </div>
          }
          <div className="row">
            <div className="col-sm-12" style={{ marginTop: '20px', marginBottom: '10px' }}>
              <hr />
              {props.project_description}
              <hr />
              <div>
                <label htmlFor="contact">Project contact:&nbsp;</label><span name="contact">{props.coa_contact}</span>
              </div>
              <div>
                <label htmlFor="contact_phone">Contact phone:&nbsp;</label><span name="contact_phone">{props.phone_number}</span>
              </div>
              <div>
                <label htmlFor="contact_email">Contact email:&nbsp;</label><span name="contact_email">{props.email_address}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <Map data={getMyPoints(props.project)} height="230px" bounds={calculateBounds(getMyPoints(props.project))} />
          <a href={props.photo_url} target="_blank">
            <img alt="Photo of project" className="img-responsive" src={props.photo_url} style={{ maxHeight: '400px' }} />
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
  description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
  hideTitle: false,
};

export default ProjectDetails;
