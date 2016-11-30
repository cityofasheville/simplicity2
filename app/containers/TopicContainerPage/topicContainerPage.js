/*
 *
 * TopicContainerPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
// import messages from './topicContainerPageMessages';
import styles from './topicContainerPageStyles.css';

export class TopicContainerPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.topicContainerPage}>
        <Helmet
          title="TopicContainerPage"
          meta={[
            { name: 'description', content: 'Description of TopicContainerPage' },
          ]}
        />
        {this.props.children}
      </div>
    );
  }
}

TopicContainerPage.propTypes = {
  children: React.PropTypes.any,
};

function mapStateToProps(state) {
  const { topicContainerPage } = state;
  const props = {
    topicContainerPage,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicContainerPage);
