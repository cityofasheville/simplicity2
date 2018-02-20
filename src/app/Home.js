import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from './search/SearchBarLink'; // temporarily using the link version
import Topics from './Topics';

const Homepage = props => (
  <div>
    <div className="row">
      <SearchBar location={props.location} selectedEntities={props.location.query.entities !== undefined ? props.location.query.entities : 'address,property,neighborhood,street,owner,google'} />
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
