import React from 'react';

import messages from './footerMessages';
import A from 'components/A/a';
import styles from './footerStyles.css';
import { FormattedMessage } from 'react-intl';
import LocaleToggle from 'containers/LocaleToggle/localeToggle';

function Footer() {
  return (
    <footer className={styles.footer}>
      <section>
        <p>
          <FormattedMessage {...messages.licenseMessage} />
        </p>
      </section>
      <section>
        <LocaleToggle />
      </section>
      <section>
        <p>
          <FormattedMessage
            {...messages.authorMessage}
            values={{
              author: <A href="https://twitter.com/mxstbr">Max Stoiber</A>,
            }}
          />
        </p>
      </section>
    </footer>
  );
}

export default Footer;
