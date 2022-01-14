import React from 'react';
import PropTypes from 'prop-types';
import TopicCard from '../shared/TopicCard';
import { withLanguage } from '../utilities/lang/LanguageContext';
import {
  IM_TREE
} from '../shared/iconConstants';
import Icon from '../shared/Icon';

const Topics = props => (
  <div className="card-container">
    <div className="row">
      <div className="col-sm-12">
        <h2>View citywide topic <strong>dashboards</strong> about your community.</h2>
      </div>
    </div>
    <div className="row topic-options">
      {props.topics.map((topic, i) => (
        <div className="card-item" key={['topic', i].join('_')}>
          <TopicCard topic={topic.name} lang={props.language.language} view={null} path={topic.path || topic.name} />
        </div>
      ))}
      <div className="card-item">
        <a className="topic-card" target='blank' href={'https://avl.maps.arcgis.com/apps/instant/lookup/index.html?appid=10e2c4ae45614b92ad4efaa61342b249%2F'}>
          <div className="topicCard">
            <div className="text-primary text-center"><Icon path={IM_TREE} size={75} /></div>
            <div className="text-primary text-center">
              CLIMATE JUSTICE
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
);

// Topics.propTypes = {
//   topics: PropTypes.arrayOf([PropTypes.oneOf(PropTypes.string, PropTypes.shape({}))]),
// };

Topics.defaultProps = {
  topics: [
    // {
    //   name: 'BUDGET',
    //   path: 'budget',
    // },
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
