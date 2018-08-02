import React from 'react';

const LangContext = React.createContext();

export default class LanguageProvider extends React.Component {
  state = {
    language: 'English',
    dropdownOpen: false,
    switchLanguage: (newLang, dropdownOpen) => {
      this.setState({ language: newLang, dropdownOpen });
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
