import React from 'react';

const LangContext = React.createContext();

export default class LanguageProvider extends React.Component {
  state = {
    language: 'English',
    label: 'English',
    dropdownOpen: false,
    switchLanguage: (newLang, label, dropdownOpen) => {
      this.setState({ language: newLang, label, dropdownOpen });
    },
  }
  render() {
    return <LangContext.Provider value={this.state}>{this.props.children}</LangContext.Provider>;
  }
}

export function withLanguage(Component) {
  return function LanguagedComponent(props) {
    return (
      <LangContext.Consumer>
        {context => <Component {...props} language={context} />}
      </LangContext.Consumer>
    );
  };
}
