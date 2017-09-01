import React from 'react';
import PropTypes from 'prop-types';
import ProjectMap from './ProjectMap';
import Icon from '../../shared/Icon';
import { IM_QUESTION, IM_MAP5, IM_SPHERE3, IM_CIRCLE2, IM_CERTIFICATE } from '../../shared/iconConstants';

const getIcon = (category) => {
  switch(category) {
    default:
      return <Icon path={IM_QUESTION} size={30} />
  }
};

const getStageNumber = (stage) => {
  const newStage = stage.split(': ')[1];
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
          {props['Project Webpage (more information)'] !== '' &&
            <div className="row">
              <div className="col-sm-12" style={{ marginTop: '5px' }}>
                <div className="pull-left" style={{ marginRight: '10px', marginBottom: '20px' }}> <a title="View project in story map" href={props['Project Webpage (more information)']} target="_blank"><Icon path={IM_SPHERE3} size={20} /> Project Website</a></div>
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
                  <strong>{props['Total Project Funding (Budget Document)']}</strong>
                </div>
              </div>
              {props['Need PM Fields?'].toLowerCase() === 'yes' &&
                <div className="text-center" style={{ marginBottom: '10px' }}>
                  <div style={{ color: '#676873' }}>
                    Spent
                  </div>
                  <div>
                    <strong>{['$', parseInt(props['LTD Actuals']).toLocaleString()].join('')}</strong>
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
                  <strong>{props['Zip Code'] || '?'}</strong>
                </div>
              </div>
              {props['Need PM Fields?'].toLowerCase() === 'yes' &&
                <div className="text-center" style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#676873' }}>
                    Estimated Construction Timeframe
                  </div>
                  <div>
                    <strong>{props['Estimated Construction Timeframe'] || '?'}</strong>
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
          {props['Need PM Fields?'].toLowerCase() === 'yes' &&
            <div className="row">
              <div className="text-center" style={{ marginBottom: '5px', color: '#676873' }}>
                Project phase
              </div>
              <div className={props.Status === 'Ongoing' ? "col-xs-3" : "col-xs-2"}>
                <Icon path={IM_CIRCLE2} size={25} color={getStageNumber(props.Status) >= 1 ? phaseColor(1) : '#ecf0f1'} />
              </div>
              <div className={props.Status === 'Ongoing' ? "col-xs-3" : "col-xs-2"}>
                <Icon path={IM_CIRCLE2} size={25}  color={getStageNumber(props.Status) >= 2 ? phaseColor(2) : '#ecf0f1'} />
              </div>
              <div className={props.Status === 'Ongoing' ? "col-xs-3" : "col-xs-2"}>
                <Icon path={IM_CIRCLE2} size={25}  color={props.Status === 'Ongoing' ? '#FFC107' : getStageNumber(props.Status) >= 3 ? phaseColor(3) : '#ecf0f1'} />
              </div>
              {props.Status !== 'Ongoing' &&
                <div className="col-xs-2">
                  <Icon path={IM_CIRCLE2} size={25} color={getStageNumber(props.Status) >= 4 ? phaseColor(4) : '#ecf0f1'} style={{ marginRight: '5px' }} />
                </div>
              }
              <div className="col-xs-2" style={{ color: props.Status === 'Ongoing' ? '#FFC107' : phaseColor(getStageNumber(props.Status)), fontWeight: 'bold' }}>
                {props.Status === 'Ongoing' ? props.Status : props.Status.split(': ')[1]}
              </div>
            </div>
          }
          <div className="row">
            <div className="col-sm-12" style={{ marginTop: '20px', marginBottom: '10px' }}>
              <hr />
              {props['Project Description']}
              <hr />
              <div>
                <label htmlFor="contact">Project contact:&nbsp;</label><span name="contact">{props['COA Contact']}</span>
              </div>
              <div>
                <label htmlFor="contact_phone">Contact phone:&nbsp;</label><span name="contact_phone">{props['Phone Number']}</span>
              </div>
              <div>
                <label htmlFor="contact_email">Contact email:&nbsp;</label><span name="contact_email">{props['Email Address']}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <ProjectMap name={props['Project']} />
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