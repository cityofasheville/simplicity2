import React from 'react';
import PropTypes from 'prop-types';

import Search from './search/Search';
import SuggestSearch from './search/SuggestSearch';
import SuggestSearchWrapper from './search/SuggestSearchWrapper';
import Topics from './Topics';
import GetVersion from '../shared/GetVersion'

function Homepage(props)  {
  return (
    <div className="template__home">
      <div>
        <GetVersion />
        <SuggestSearchWrapper />
      </div>
      <hr className="my-5"/>
      <Topics />
    </div>
  );
}

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
