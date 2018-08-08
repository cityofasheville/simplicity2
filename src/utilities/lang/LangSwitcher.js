import React from 'react';
import { withLanguage } from './LanguageContext';

const LangSwitcher = props => (
  <li className={['dropdown', props.language.dropdownOpen ? 'open' : ''].join(' ')}>
    <a
      className="dropdown-toggle"
      onClick={() => props.language.switchLanguage(props.language.language, props.language.label, !props.language.dropdownOpen)}
      data-toggle="dropdown"
      role="button"
      aria-haspopup="true"
      aria-expanded="false"
    >{props.language.label}
      <span className="caret"></span>
    </a>
    <ul className="dropdown-menu">
      <li>
        <a
          href="#"
          onClick={() => props.language.switchLanguage('English', 'English', false)}
          className=""
        >English
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={() => props.language.switchLanguage('Spanish', 'Espa\xF1ol', false)}
          className=""
          >{'Espa\xF1ol'}
        </a>
      </li>
    </ul>
  </li>
);

export default withLanguage(LangSwitcher);

