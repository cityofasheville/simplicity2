import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import { RadioGroup, Radio } from 'react-radio-group';
import Icon from '../../shared/Icon';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import { query } from './ProjectFlowQueries';
import ProjectFlowTable from './ProjectFlowTable';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { IM_OFFICE } from '../../shared/iconConstants';

const getIcon = (type) => {
  switch (type) {
    case 'Priority 1':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><text x="7" y="24" fontFamily="Roboto" fontSize="24" fill="#fff">1</text></svg>;
    case 'Priority 2':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><text x="7" y="24" fontFamily="Roboto" fontSize="24" fill="#fff">2</text></svg>;
    case 'Priority 3':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><text x="7" y="24" fontFamily="Roboto" fontSize="24" fill="#fff">3</text></svg>;
    case 'Project Small  5-20 Hrs':
    case 'Project Small':
    case 'Project Small 5-20 Hrs':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><text x="7" y="24" fontFamily="Roboto" fontSize="24" fill="#fff">S</text></svg>;
    case 'Project Large':
    case 'Project Larger 100 Hrs':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><text x="7" y="24" fontFamily="Roboto" fontSize="24" fill="#fff">L</text></svg>;
    case 'Project Medium':
    case 'Project Medium 20-100 Hrs':
      return <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><text x="4" y="24" fontFamily="Roboto" fontSize="24" fill="#fff">M</text></svg>;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" height="25px" transform="translate(0,4)" version="1.1" viewBox="0 0 16 16" width="25px"><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill="#fff" id="Group" transform="translate(-528.000000, -576.000000)"><path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" id="Oval 12 copy" /></g></g></svg>;
  }
};

const isProject = priority => (
  ['Project Small 5-20 Hrs', 'Project Small  5-20 Hrs', 'Project Small', 'Project Large', 'Project Larger 100 Hrs', 'Project Medium', 'Project Medium 20-100 Hrs'].indexOf(priority) > -1
);

const sumByType = (projects) => {
  let numProjects = 0;
  let numTasks = 0;
  for (let p of projects) {
    if (['Priority 1', 'Priority 2', 'Priority 3'].indexOf(p.Priority) > -1) {
      numTasks += 1;
    } else {
      numProjects += 1;
    }
  }
  return { projects: numProjects, tasks: numTasks };
};

const ProjectFlowDashboard = (props) => {
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

  const refreshLocation = (value) => {
    browserHistory.push([props.location.pathname, '?view=', value].join(''));
  };

  return (
    <div>
      <PageHeader h1="BPT Projects Dashboard" icon={<Icon path={IM_OFFICE} size={30} />}>
        <ButtonGroup>
          <Button onClick={browserHistory.goBack}>Back</Button>
        </ButtonGroup>
      </PageHeader>
      {
        <div>
          {
            props.bpt.map((techName, idx) => {
              let displayName = techName;
              if (techName === '-') { // All projects
                displayName = 'All BPT Projects';
                open = props.data.projects.filter(itm => (itm.CurrentStatus === 'Open'));
                inProgress = props.data.projects.filter(itm => (itm.CurrentStatus === 'In Progress'));
                pending = props.data.projects.filter(itm => (
                  itm.CurrentStatus !== 'In Progress' && itm.CurrentStatus !== 'Open'
                ));
              } else {
                open = props.data.projects.filter(itm => (itm.CurrentStatus === 'Open' && itm.AssignedTechnician === techName));
                inProgress = props.data.projects.filter(itm => (itm.CurrentStatus === 'In Progress' && itm.AssignedTechnician === techName));
                pending = props.data.projects.filter(itm => (
                  itm.CurrentStatus !== 'In Progress' && itm.CurrentStatus !== 'Open' && itm.AssignedTechnician === techName
                ));
              }
              const sumsOpen = sumByType(open);
              const sumsInProgress = sumByType(inProgress);
              const sumsPending = sumByType(pending);
              return (
                <div className="row" key={`projects-${idx}`}>
                  <h1 style={{ marginTop: '40px' }}>{displayName}
                    <div className="radioGroup pull-right" style={{ marginBottom: '3px' }}>
                      <RadioGroup name={['viewRadio', `projects-${idx}`].join('_')} selectedValue={props.location.query.view || 'kanban'} onChange={refreshLocation} style={{ fontSize: '16px', marginTop: '15px', color: 'black' }}>
                        <label>
                          <Radio value="kanban" />kanban
                        </label>
                        <label>
                          <Radio value="table" />table
                        </label>
                      </RadioGroup>
                    </div>
                  </h1>
                  { props.location.query.view === 'table' ?
                    <ProjectFlowTable data={props.data.projects.filter(itm => (itm.AssignedTechnician === (techName === '-' ? itm.AssignedTechnician : techName)))} id={['table', idx].join('_')} />
                  :
                    <div>
                      <div className="col-sm-4 kanban-col">
                        <div className="kanban-phase">
                          <h2>Open<span className="kanban-badge">{sumsOpen.tasks}</span><span className="kanban-badge kanban-project">{sumsOpen.projects}</span></h2>
                          {
                            open.map((itm, index) => (
                              <div key={[itm.ID, index].join('_')} className={isProject(itm.Priority) ? 'kanban-item kanban-project' : 'kanban-item'}>
                                <div className="kanban-icon">
                                  {getIcon(itm.Priority, false)}
                                </div>
                                <div className="kanban-text">
                                  {itm.Summary}
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      <div className="col-sm-4 kanban-col">
                        <div className="kanban-phase">
                          <h2>In Progress<span className="kanban-badge">{sumsInProgress.tasks}</span><span className="kanban-badge kanban-project">{sumsInProgress.projects}</span></h2>
                          {
                            inProgress.map((itm, index) => (
                              <div key={[itm.ID, index].join('_')} className={isProject(itm.Priority) ? 'kanban-item kanban-project' : 'kanban-item'}>
                                <div className="kanban-icon">
                                  {getIcon(itm.Priority, false)}
                                </div>
                                <div className="kanban-text">
                                  {itm.Summary}
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      <div className="col-sm-4 kanban-col">
                        <div className="kanban-phase">
                          <h2>Waiting<span className="kanban-badge">{sumsPending.tasks}</span><span className="kanban-badge kanban-project">{sumsPending.projects}</span></h2>
                          {
                            pending.map((itm, index) => (
                              <div key={[itm.ID, index].join('_')} className={isProject(itm.Priority) ? 'kanban-item kanban-project' : 'kanban-item'}>
                                <div className="kanban-icon">
                                  {getIcon(itm.Priority, false)}
                                </div>
                                <div className="kanban-text">
                                  {itm.Summary}
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              );
            })
          }
        </div>
      }
    </div>
  );
};

ProjectFlowDashboard.propTypes = {
  data: PropTypes.object,
  bpt: PropTypes.arrayOf(String)
};

ProjectFlowDashboard.defaultProps = {
  bpt: [
    '*BPT Team',
    'Tom Pace',
    'Christen McNamara',
    'Eric LaRue',
    'Manasa Vankamamidi',
    'Stephanie Osbourn',
    'Scott Barnwell',
    'Eric Jackson',
    'Frances Ruiz',
    '-', // All projects
  ],
};

export default graphql(query, {
  options: ownProps => ({
    variables: {
      projects: ownProps.bpt,
    },
  }),
})(ProjectFlowDashboard);

