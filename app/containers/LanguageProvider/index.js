/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

export class LanguageProvider extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <IntlProvider locale={this.props.locale} messages={this.props.messages[this.props.locale]}>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  locale: React.PropTypes.string,
  messages: React.PropTypes.object,
  children: React.PropTypes.element.isRequired,
};

function mapStateToProps(state) {
  const { language } = state;
  const props = {
    locale: language.locale,
  };
  return props;
}

export default connect(mapStateToProps)(LanguageProvider);
