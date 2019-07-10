import React from 'react';
import PropTypes from 'prop-types';

import Search from './search/Search';
import Topics from './Topics';

const Homepage = props => (
  <div className="template__home">
    <div>
      <Search
        location={props.location}
        selectedEntities={props.location.query.entities !== undefined ? props.location.query.entities : 'address,property,neighborhood,street,owner'}
      />
    </div>
    <hr />
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
