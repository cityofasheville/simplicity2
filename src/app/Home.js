import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from './search/SearchBarLink'; // temporarily using the link version
import Topics from './Topics';

const Homepage = props => (
  <div>
    <div className="row">
      <SearchBar />
    </div>
    <Topics />
  </div>
);

Homepage.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string),
};

Homepage.defaultProps = {
  topics: [
    'BUDGET',
    'CAPITAL_PROJECTS',
    'CRIME',
    'DEVELOPMENT',
    // 'HOMELESSNESS',
  ],
};

export default Homepage;




