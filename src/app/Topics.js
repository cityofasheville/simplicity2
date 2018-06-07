import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import TopicCard from '../shared/TopicCard';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';

const GET_LANGUAGE = gql`
  query language {
    language {
      lang
    }
  }
`;

const Topics = props => (
  <Query
    query={GET_LANGUAGE}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;
      return (
        <div className="card-container">
          <div className="row">
            <div className="col-sm-12">
              <h2>View citywide topic <strong>dashboards</strong> about your community.</h2>
            </div>
          </div>
          <div className="row">
            {props.topics.map((topic, i) => (
              <div className="card-item" key={['topic', i].join('_')}>
                <TopicCard topic={topic} entity="city" label="City of Asheville" lang={data.language.lang} />
              </div>
            ))}
          </div>
        </div>
      );
    }}
  </Query>
);

Topics.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string),
};

Topics.defaultProps = {
  topics: [
    'BUDGET',
    'CAPITAL_PROJECTS',
    //'CRIME',
    //'DEVELOPMENT',
    'HOMELESSNESS',
  ],
};

export default Topics;
