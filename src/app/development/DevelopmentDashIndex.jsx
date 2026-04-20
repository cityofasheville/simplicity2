import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import BigNumber from '../../shared/visualization/BigNumber';
import {
  GET_PERMITS_FOR_COUNTING,
  GET_WORKFLOW_TASKS_FOR_COUNTING,
} from './volume/granularUtils';

const DevelopmentDashIndex = props => (
  <div className="container card-container">
    <div className="row">
      <div className="col-sm-12">
        <h1>Development Data</h1>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <h2>Last 30 Days</h2>
        <BigNumber
          label="New Accela Records"
          query={GET_PERMITS_FOR_COUNTING}
          queryVars={{
            after: new Date(new Date().getTime() - 2678400000),
          }}
          aggregateFunction={data => data.permits.length}
        />
        <BigNumber
          label="Accela Workflow Tasks Updated"
          query={GET_WORKFLOW_TASKS_FOR_COUNTING}
          queryVars={{
            after: new Date(new Date().getTime() - 2678400000),
          }}
          aggregateFunction={data => data.permit_tasks.length}
        />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <h2>Dashboards, Tables, and Interactives</h2>
        {props.topics.map((topic, i) => (
          <div className="card-item" key={['topic', i].join('_')}>
            <Link
              className="topic-card"
              to={topic.linkTo}
            >
              <div>
                {/* <div className="text-primary text-center">Picture</div> */}
                <div className="text-primary text-center">
                  {topic.name}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);

DevelopmentDashIndex.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.object),
};

DevelopmentDashIndex.defaultProps = {
  topics: [
    {
      name: 'Permit Module Volume Detail',
      linkTo: {
        pathname: '/development/granular_volume',
        search: '?permit_group=permits',
      },
    },
    {
      name: 'Planning Module Volume Detail',
      linkTo: {
        pathname: '/development/granular_volume',
        search: '?permit_group=planning'
      }
    },
    {
      name: 'Service Module Volume Detail',
      linkTo: {
        pathname: '/development/granular_volume',
        search: '?permit_group=services',
      },
    },
    {
      name: 'Permit Module Status Detail',
      linkTo: {
        pathname: '/development/status_volume',
        search: '?permit_group=permits',
      },
    },
    {
      name: 'Planning Module Status Detail',
      linkTo: {
        pathname: '/development/status_volume',
        search: '?permit_group=planning'
      }
    },
    {
      name: 'Service Module Status Detail',
      linkTo: {
        pathname: '/development/status_volume',
        search: '?permit_group=services',
      },
    },
    {
      name: 'Service Level Agreement',
      linkTo: {
        pathname: '/development/sla-dashboard',
      }
    },
    {
      name: 'Table of All Permits',
      linkTo: {
        pathname: '/permits',
      },
    },
    {
      name: 'Major Development Dashboard',
      linkTo: {
        pathname: '/development/major'
      }
    },
  ],
};

// export default withLanguage(DevelopmentDashIndex);
export default DevelopmentDashIndex;
