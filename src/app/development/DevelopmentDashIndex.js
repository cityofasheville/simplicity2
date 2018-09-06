import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import BigNumber from '../../shared/visualization/BigNumber';

const DevelopmentDashIndex = props => (
  <div className="card-container">
    <div className="row">
      <div className="col-sm-12">
        <h1>Development Services</h1>
      </div>
    </div>
    <div className="row">
      <h2>Last 30 Days</h2>
      <BigNumber
        label="New Permits"
        tempNumber="42"
        query=""
        aggregateFunction=""
      />
      <BigNumber
        label="Scheduled Inspections"
        tempNumber="3,987"
        query=""
        aggregateFunction=""
      />
      <BigNumber
        label="Tasks Completed"
        tempNumber="11,297"
        query=""
        aggregateFunction=""
      />
    </div>
    <div className="row">
      <h2>Dashboards</h2>
      {props.topics.map((topic, i) => (
        <div className="card-item" key={['topic', i].join('_')}>
          <Link
            className="topic-card"
            to={{
              pathname: topic.linkPath,
            }}
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
);

DevelopmentDashIndex.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string),
};

DevelopmentDashIndex.defaultProps = {
  topics: [
    {
      name: 'Granular Volume I',
      linkPath: '/development/granular_volume',
    },
    {
      name: 'Granular Volume II',
      linkPath: '/',
    },
    {
      name: 'Volume Overlay',
      linkPath: '/development/volume',
    },
    {
      name: 'TRC',
      linkPath: '/development/trc',
    },
  ],
};

// export default withLanguage(DevelopmentDashIndex);
export default DevelopmentDashIndex;
