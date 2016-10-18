/*
 *
 * MySimpliCity
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import messages from './mySimpliCityPageMessages';
import styles from './mySimpliCityPageStyles.css';
import MySimpliCityCards from '../../topics/mysimplicity/mySimpliCityCards';

export class MySimpliCityPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.mySimpliCity}>
        <Helmet
          title="MySimpliCityPage"
          meta={[
            { name: 'description', content: 'Description of MySimpliCity' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <h1>My SimpliCity</h1>
        <MySimpliCityCards />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { mySimpliCityPage } = state;
  const props = {
    mySimpliCityPage,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MySimpliCityPage);
