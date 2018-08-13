import React from 'react';
import { Query } from 'react-apollo';
import { getSankeyData } from './graphql/budgetQueries';
import Sankey from '../../shared/visualization/Sankey';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const BudgetSankey = props => (
  <Query
    query={getSankeyData}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      // set language
      let content;
      switch (props.language.language) {
        case 'Spanish':
          content = spanish;
          break;
        default:
          content = english;
      }
      return (
        <Sankey
          nodes={data.sankeyData.nodes}
          links={data.sankeyData.links}
          altText={content.flow_diagram}
          valueFormatter={(value) => {
            if (!value || value === 0) { return '$0'; }
            return [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('');
          }}
        />
      );
    }}
  </Query>
);

export default withLanguage(BudgetSankey);
