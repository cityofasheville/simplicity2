import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../shared/Icon';
import { IM_QUESTION, IM_MAP5, IM_SPHERE3, IM_CIRCLE2 } from '../../shared/iconConstants';

const getIcon = (category) => {
  switch(category) {
    default:
      return <Icon path={IM_QUESTION} size={30} />
  }
};

const getStageNumber = (stage) => {
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
      return '#9C27B0';
    case 2:
      return '#03A9F4';
    case 3:
      return '#FF5722';
    default:
      return '#57d500';
  }
};

const ProjectDetails = (props) => (
  <div className="row">
    <div className="col-sm-12">
      <div className="row">
        <div className="col-sm-12">
          <h4>{getIcon()} {props.name}</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-xs-6">
          <div style={{ background: 'antiquewhite', height: '230px', paddingLeft: '15px' }}>
            SOME image here
          </div>
        </div>
        <div className="col-sm-3 col-xs-6">
          <div className="text-center" style={{ marginBottom: '10px', marginTop: '5px' }}>
            <div className="text-primary">
              <strong>Zip code</strong>
            </div>
            <div>
              {props.zip}
            </div>
          </div>
          <div className="text-center" style={{ marginBottom: '10px' }}>
            <div className="text-primary">
              <strong>Total bond funding</strong>
            </div>
            <div>
              {props.total}
            </div>
          </div>
          <div className="text-center" style={{ marginBottom: '10px' }}>
            <div className="text-primary">
              <strong>Spent</strong>
            </div>
            <div>
              {props['Expended funds']}
            </div>
          </div>         
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <div className="text-primary">
              <strong>Construction start</strong>
            </div>
            <div>
              {props.construction_start}
            </div>
          </div>
        </div>
        <div className="col-sm-5 col-xs-12">
          <div className="row">
            <div className="col-sm-12">
              <div className="text-primary text-center">
                <strong>Project phase</strong>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginBottom: '20px', marginTop: '5px' }}>
            <div className="col-xs-2">
              <Icon path={IM_CIRCLE2} size={25} color={getStageNumber(props.phase) >= 1 ? phaseColor(1) : '#ecf0f1'} />
            </div>
            <div className="col-xs-2">
              <Icon path={IM_CIRCLE2} size={25}  color={getStageNumber(props.phase) >= 2 ? phaseColor(2) : '#ecf0f1'} />
            </div>
            <div className="col-xs-2">
              <Icon path={IM_CIRCLE2} size={25}  color={getStageNumber(props.phase) >= 3 ? phaseColor(3) : '#ecf0f1'} />
            </div>
            <div className="col-xs-2">
              <Icon path={IM_CIRCLE2} size={25} color={getStageNumber(props.phase) >= 4 ? phaseColor(4) : '#ecf0f1'} style={{ marginRight: '5px' }} />
            </div>
            <div className="col-xs-2" style={{ color: phaseColor(getStageNumber(props.phase)) }}>
              {props.phase}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12" style={{ marginBottom: '10px' }}>
              {props.description}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="pull-right"> <a title="View project in story map"><Icon path={IM_MAP5} size={20} /> View in Story Map</a></div>
          <div className="pull-right" style={{ marginRight: '10px' }}> <a title="View project in story map"><Icon path={IM_SPHERE3} size={20} /> Project Website</a></div>
        </div>
      </div>
    </div>
  </div>
);

ProjectDetails.propTypes = {
  description: PropTypes.string,
};

ProjectDetails.defaultProps = {
  description: "This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.",
};

export default ProjectDetails;