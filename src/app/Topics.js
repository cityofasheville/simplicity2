import React from 'react';
import PropTypes from 'prop-types';
import TopicCard from '../shared/TopicCard';
import { withLanguage } from '../utilities/lang/LanguageContext';
import {
  IM_TREE
} from '../shared/iconConstants';
import Icon from '../shared/Icon';

const Topics = props => (
  <div className="pt-5">
    <div>
      <div>
        <h2 className="text-3xl text-coa-blue-medium pb-3">View citywide topic <strong>dashboards</strong> about your community.</h2>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3">
      {props.topics.map((topic, i) => (
        <div className="p-4" key={['topic', i].join('_')}>
          <TopicCard topic={topic.name} lang={props.language.language} view={null} path={topic.path || topic.name} />
        </div>
      ))}
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
      name: 'DEVELOPMENT_DASHBOARD',
      path: '/development/major'
    },
    {
      name: 'CLIMATE',
      path: 'https://avl.maps.arcgis.com/apps/instant/lookup/index.html?appid=10e2c4ae45614b92ad4efaa61342b249%2F'
    },
  ],
};

export default withLanguage(Topics);
