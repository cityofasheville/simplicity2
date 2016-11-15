/*
 *
 * SearchResultsPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import messages from './searchResultsPageMessages';
import styles from './searchResultsPageStyles.css';

export class SearchResultsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <article>
        <div className={styles.searchResultsPage}>
          <Helmet
            title="SearchResultsPage"
            meta={[
              { name: 'description', content: 'Description of SearchResultsPage' },
            ]}
          />
          <FormattedMessage {...messages.header} />
        </div>
      </article>

    );
  }
}

function mapStateToProps(state, ownProps) {
  const { searchResultsPage } = state;
  const props = {
    searchResultsPage,
    ownProps,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsPage);
