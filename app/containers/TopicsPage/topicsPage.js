/*
 *
 * Topics Page
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import messages from './topicsPageMessages';
import styles from './topicsPageStyles.css';

export class TopicsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.topics}>
        <Helmet
          title="TopicsPage"
          meta={[
            { name: 'description', content: 'Description of Topics' },
          ]}
        />
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { topicsPage } = state;
  const props = {
    topicsPage,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicsPage);
