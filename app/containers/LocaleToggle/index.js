/*
 *
 * LanguageToggle
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { changeLocale } from '../LanguageProvider/actions';
import { appLocales } from '../../i18n';
import styles from './styles.css';
import messages from './messages';
import Toggle from 'components/Toggle/toggle';

export class LocaleToggle extends React.Component { // eslint-disable-line
  render() {
    return (
      <div className={styles.localeToggle}>
        <Toggle values={appLocales} messages={messages} onToggle={this.props.onLocaleToggle} />
      </div>
    );
  }
}

LocaleToggle.propTypes = {
  onLocaleToggle: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { language } = state;
  const props = {
    locale: language.locale,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    onLocaleToggle: (evt) => dispatch(changeLocale(evt.target.value)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocaleToggle);
