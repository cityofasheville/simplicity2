/*
 *
 * MySimpliCity
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
// import messages from './mySimpliCityPageMessages';
import styles from './mySimpliCityPageStyles.css';
// import MySimpliCityCards from '../../topics/mysimplicity/mySimpliCityCards';

export class MySimpliCityPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <article>
        <div className={styles.mySimpliCity}>
          <Helmet
            title="MySimpliCityPage"
            meta={[
              { name: 'description', content: 'Description of MySimpliCity' },
            ]}
          />
          <section>
            <div className={styles.container}>
              <div className={styles.card}>
                <div className={styles.header}>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.icon}>
                    <i className="fa fa-lg fa-building" aria-hidden="true"></i>
                  </h3>
                  <h3 className={styles.title}>Development SLA Dashboard</h3>
                  <div className={styles.description}>
                    Street art tilde viral, poutine flannel crucifix kickstarter church-key lumbersexual williamsburg everyday.
                  </div>
                </div>
                <div className={styles.footer}>
                  <p className={styles.right}>Performance</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.header}>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.icon}>
                    <i className="fa fa-lg fa-shield" aria-hidden="true"></i>
                  </h3>
                  <h3 className={styles.title}>Crime: Citywide</h3>
                  <div className={styles.description}>
                  Semiotics viral kogi forage, locavore air plant gentrify kombucha hell of. Bitters tofu jianbing, hashtag schlitz gentrify distillery actually selfies waistcoat umami flexitarian. </div>
                </div>
                <div className={styles.footer}>
                  <p className={styles.right}>Topic</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.header}>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.icon}>
                    <i className="fa fa-lg fa-money" aria-hidden="true"></i>
                  </h3>
                  <h3 className={styles.title}>Department Budget: IT</h3>
                  <div className={styles.description}>
                    Street art tilde viral, poutine flannel crucifix kickstarter church-key lumbersexual williamsburg everyday.
                  </div>
                </div>
                <div className={styles.footer}>
                  <p className={styles.right}>Topic</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.header}>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.icon}>
                    <i className="fa fa-lg fa-building" aria-hidden="true"></i>
                  </h3>
                  <h3 className={styles.title}>Development: Montford</h3>
                  <div className={styles.description}>
                    Slow-carb street art pinterest, squid venmo actually hoodie woke jianbing dreamcatcher yr. Next level tacos ugh bitters, paleo ethical ramps small batch taxidermy food truck thundercats lo-fi.
                  </div>
                </div>
                <div className={styles.footer}>
                  <p className={styles.right}>Topic</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.header}>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.icon}>
                    <i className="fa fa-lg fa-pause" aria-hidden="true"></i>
                  </h3>
                  <h3 className={styles.title}>Equity: Citywide</h3>
                  <div className={styles.description}>
                    Slow-carb street art pinterest, squid venmo actually hoodie woke jianbing dreamcatcher yr. Next level tacos ugh bitters, paleo ethical ramps small batch taxidermy food truck thundercats lo-fi.
                  </div>
                </div>
                <div className={styles.footer}>
                  <p className={styles.right}>Performance</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.header}>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.icon}>
                    <i className="fa fa-lg fa-shield" aria-hidden="true"></i>
                  </h3>
                  <h3 className={styles.title}>Crime: Montford</h3>
                  <div className={styles.description}>
                  Slow-carb street art pinterest, squid venmo actually hoodie woke jianbing dreamcatcher yr. Next level tacos ugh bitters, paleo ethical ramps small batch taxidermy food truck thundercats lo-fi.
                  </div>
                </div>
                <div className={styles.footer}>
                  <p className={styles.right}>Topic</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
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
