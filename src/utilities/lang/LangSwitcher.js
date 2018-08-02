import React from 'react';
import { withLanguage } from './LanguageContext';

const LangSwitcher = props => (
  <li className={['dropdown', props.language.dropdownOpen ? 'open' : ''].join(' ')}>
    <a
      className="dropdown-toggle"
      onClick={() => props.language.switchLanguage(props.language.language, !props.language.dropdownOpen)}
      data-toggle="dropdown"
      role="button"
      aria-haspopup="true"
      aria-expanded="false"
    >{props.language.language}
      <span className="caret"></span>
    </a>
    <ul className="dropdown-menu">
      <li>
        <a
          href="#"
          onClick={() => props.language.switchLanguage('English', false)}
          className=""
        >English
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={() => props.language.switchLanguage('Spanish', false)}
          className=""
          >Spanish
        </a>
      </li>
    </ul>
  </li>
);

export default withLanguage(LangSwitcher);

