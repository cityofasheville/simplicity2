import React from 'react';
import PropTypes from 'prop-types';
import TopicCard from '../shared/TopicCard';
import { withLanguage } from '../utilities/lang/LanguageContext';

const Topics = props => (
  <div className="card-container">
    <div className="row">
      <div className="col-sm-12">
        <h2>View citywide topic <strong>dashboards</strong> about your community.</h2>
      </div>
    </div>
    <div className="row">
      {props.topics.map((topic, i) => (
        <div className="card-item" key={['topic', i].join('_')}>
          <TopicCard topic={topic.name} entity="city" label="City of Asheville" lang={props.language.language} path={topic.path || topic.name} />
        </div>
      ))}
    </div>
  </div>
);

Topics.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string),
};

Topics.defaultProps = {
  topics: [
    {
      name: 'BUDGET',
      path: 'budget',
    },
    {
      name: 'CAPITAL_PROJECTS',
      path: 'capital_projects',
    },
    {
      name: 'DEVELOPMENT',
      path: '/development/major'
    },
  ],
};

export default withLanguage(Topics);
