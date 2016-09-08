/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import messages from './notFoundPageMessages';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button/button';

export function NotFound(props) {
  return (
    <article>
      <h1>
        <FormattedMessage {...messages.header} />
      </h1>
      <Button
        handleRoute={function redirect() {
          props.changeRoute('/');
        }}
      >
        <FormattedMessage {...messages.homeButton} />
      </Button>
    </article>
  );
}

NotFound.propTypes = {
  changeRoute: React.PropTypes.func,
};

// react-redux stuff
function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(null, mapDispatchToProps)(NotFound);
