import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import Icon from '../../shared/Icon';
import { IM_OFFICE } from '../../shared/iconConstants';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import { query } from './ProjectFlowQueries';
import LoadingAnimation from '../../shared/LoadingAnimation';

const DevelopmentSLADashboard = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }
  let open = props.data.projects.filter(itm => (itm.CurrentStatus === 'Open'));
  let inProgress = props.data.projects.filter(itm => (itm.CurrentStatus === 'In Progress'));
  let pending = props.data.projects.filter(itm => (
    itm.CurrentStatus !== 'In Progress' && itm.CurrentStatus !== 'Open'
  ));

  return (
    <div>
      <PageHeader h1="IT Projects Dashboard" icon={<Icon path={IM_OFFICE} size={30} />}>
        <ButtonGroup>
          <Button onClick={browserHistory.goBack}>Back</Button>
        </ButtonGroup>
      </PageHeader>
      {
        <div>
          {
            props.bpt.map((techName, idx) => {
              open = props.data.projects.filter(itm => (itm.CurrentStatus === 'Open' && itm.AssignedTechnician === techName));
              inProgress = props.data.projects.filter(itm => (itm.CurrentStatus === 'In Progress' && itm.AssignedTechnician === techName));
              pending = props.data.projects.filter(itm => (
                itm.CurrentStatus !== 'In Progress' && itm.CurrentStatus !== 'Open' && itm.AssignedTechnician === techName
              ));
              return (
                <div className="row" key={`projects-${idx}`}>
                  <h1>{techName}</h1>
                  <div className="col-sm-4 kanban-phase">
                    <h2>Open</h2>
                    {
                      open.map((itm, index) => (
                        <div key={[itm.ID, index].join('_')} className="kanban-item">
                          {itm.Summary}
                        </div>
                      ))
                    }
                  </div>
                  <div className="col-sm-4 kanban-phase">
                    <h2>In Progress</h2>
                    {
                      inProgress.map((itm, index) => (
                        <div key={[itm.ID, index].join('_')} className="kanban-item">
                          {itm.Summary}
                        </div>
                      ))
                    }
                  </div>
                  <div className="col-sm-4 kanban-phase">
                    <h2>Pending</h2>
                    {
                      pending.map((itm, index) => (
                        <div key={[itm.ID, index].join('_')} className="kanban-item">
                          {itm.Summary}
                        </div>
                      ))
                    }
                  </div>

                </div>
              );
            })
          }

          <div key="projects-all" className="row">
            <h1>All BPT Projects</h1>
            <div className="col-sm-4 kanban-phase">
              <h2>Open</h2>
              {
              props.data.projects.filter(itm => (itm.CurrentStatus === 'Open')).map((itm, index) => (
                <div key={[itm.ID, index].join('_')} className="kanban-item">
                  {itm.Summary}
                </div>
              ))
              }
            </div>
            <div className="col-sm-4 kanban-phase">
              <h2>In Progress</h2>
              {
              props.data.projects.filter(itm => (itm.CurrentStatus === 'In Progress')).map((itm, index) => (
                <div key={[itm.ID, index].join('_')} className="kanban-item">
                  {itm.Summary}
                </div>
              ))
              }
            </div>
            <div className="col-sm-4 kanban-phase" style={{overflow: "hidden"}}>
              <h2>Pending</h2>
              {
              props.data.projects.filter(itm => (
                itm.CurrentStatus !== 'In Progress' && itm.CurrentStatus !== 'Open'
              )).map((itm, index) => (
                <div key={[itm.ID, index].join('_')} className="kanban-item">
                  {itm.Summary}
                </div>
              ))
              }
            </div>
          </div>
        </div>
      }
    </div>
  );
};

DevelopmentSLADashboard.propTypes = {
  data: PropTypes.object,
  bpt: PropTypes.arrayOf(String)
};

DevelopmentSLADashboard.defaultProps = {
  bpt: [
    '*BPT Team',
    'Tom Pace',
    'Christen McNamara',
    'Eric LaRue',
    'Manasa Vankamamidi',
    'Stephanie Osbourn',
    'Scott Barnwell',
    'Eric Jackson',
  ],
};

export default graphql(query, {
  options: ownProps => ({
    variables: {
      projects: ownProps.bpt,
    },
  }),
})(DevelopmentSLADashboard);

