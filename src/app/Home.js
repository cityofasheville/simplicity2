import React from 'react';

import SearchBar from './search/SearchBarLink'; // temporarily using the link version
import TopicCard from '../shared/TopicCard';

const Homepage = props => (
  <div>
    <div className="row">
      <SearchBar />
    </div>
    <div className="row">
      <div className="col-xs-12">
        <h1>View citywide <strong>topic</strong> summaries about your community.</h1>
      </div>
    </div>
    <div className="row">
      {props.topics.map((topic, i) => (
        <div className="col-xs-4" key={['topic', i].join('_')}>
          <TopicCard topic={topic} entity="city" label="City of Asheville" />
        </div>
      ))}
    </div>
  </div>
);

Homepage.propTypes = {
  topics: React.PropTypes.arrayOf(React.PropTypes.string),
};

Homepage.defaultProps = {
  topics: [
    'CRIME',
    'DEVELOPMENT',
    'BUDGET',
  ],
};

export default Homepage;




