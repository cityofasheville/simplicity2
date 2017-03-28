import React from 'react';
import { Link } from 'react-router';

import SearchBar from './SearchBarLink'; // temporarily using the link version
import TopicCard from './TopicCard';

const Homepage = props => (
  <div>
    <div className="row">
      <SearchBar />
    </div>
    <div className="row">
      <div className="col-xs-12">
        <p className="text-muted text-center lead">or</p>
        <p className="text-muted text-center lead">View citywide <strong>topic</strong> summaries about your community.</p>
      </div>
    </div>
    <div className="row">
      {props.topics.map((topic, i) => (
        <div className="col-xs-4" key={['topic', i].join('_')}>
          <TopicCard topic={topic} />
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




