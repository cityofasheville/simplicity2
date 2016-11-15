/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link, browserHistory } from 'react-router';
import Helmet from 'react-helmet';


// import messages from './homePageMessages';

import { changeUsername } from './homePageActions';
import { loadRepos } from '../App/appActions';

// import { FormattedMessage } from 'react-intl';


import styles from './homePageStyles.css';

export class HomePage extends React.Component {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }
  /**
   * Changes the route
   *
   * @param  {string} route The route we want to go to
   */
  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  /**
   * Changed route to '/features'
   */
  openFeaturesPage = () => {
    this.openRoute('/features');
  };

  render() {
    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'SimpliCity homepage' },
          ]}
        />
        <div>
          <section className={styles.homeMain}>
            <p className={styles.theCityOfAshevilles}>The City of Asheville's</p>
            <h1 className={styles.homeTitle}>SimpliCity</h1>
            <p className={styles.citydatasimplified}>city data simplified</p>
            <div className={styles.searchComponent}>
              <div className={styles.searchComponentWrapper}>
                <button className={styles.allDropdown}>
                  All <i className="fa fa-caret-down" aria-hidden="true"></i>
                </button>
                <input
                  className={styles.searchInput}
                  ref={() => this.searchInput}
                  onKeyUp={() => { browserHistory.push(`/search-results?text=${this.searchInput.value}`); }}
                  placeholder="Search for a location, name or ID..."
                  type="text"
                />
                <button className={styles.searchButton}>
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </section>
          <section>
            <div className={styles.bigNavButtons}>
              <div className={styles.bigNavButton}>
                Citywide Topics
              </div>
              <div className={styles.bigNavButton}>
                Citywide Performance
              </div>
              <div className={styles.bigNavButton}>
                Explore with a Map
              </div>

            </div>
          </section>
          <section>
            <div className={styles.bigNavButtons}>
              <div className={styles.bigNavButton}>
                <Link to="/topics/topic-container-page">Test Topic Container Page</Link>
              </div>
              <div className={styles.bigNavButton}>
                <Link to="/topics/topic-container-page">Test Topic Container Page</Link>
              </div>
            </div>
          </section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
  onChangeUsername: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    changeRoute: (url) => dispatch(push(url)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
    dispatch,
  };
}

function mapStateToProps(state) {
  const { global, home, user } = state;
  const props = {
    repos: global.userData.repositories,
    username: home.username,
    loading: global.loading,
    error: global.error,
    user,
  };
  return props;
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
