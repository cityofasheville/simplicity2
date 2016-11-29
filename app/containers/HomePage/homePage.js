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

  constructor(props){
    super(props);
    this.state = {
      searchText: ""
    }

    this.handleSearchOnKeyUp = this.handleSearchOnKeyUp.bind(this);
  }

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

  handleSearchOnKeyUp(e){
    browserHistory.push(`/search-results?text=${e.target.value}`)
  }


  render() {
    return (
      <article className="container">
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'SimpliCity homepage' },
          ]}
        />
        <div>
        <div className="col-md-8 col-md-offset-2">
          <h1 className={styles.homeTitle}>SimpliCity</h1>
          <form>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                onKeyUp={this.handleSearchOnKeyUp}
                placeholder="Search for a location, name or ID..."
              />
              <span className="input-group-btn">
                <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
              </span>
            </div>
          </form>
        </div>
        <div className={["col-md-12", styles.bigNavWrapper].join(" ")}>
            <div className={["col-md-4", styles.bigNavButtonWrapper].join(" ")}>
              <div className={["col-xs-12", styles.bigNavButton].join(" ")}>
                Citywide Topics
              </div>
            </div>
            <div className={["col-md-4", styles.bigNavButtonWrapper].join(" ")}>
              <div className={["col-xs-12", styles.bigNavButton].join(" ")}>
                Citywide Performance
              </div>
            </div>
            <div className={["col-md-4", styles.bigNavButtonWrapper].join(" ")}>
              <div className={["col-xs-12", styles.bigNavButton].join(" ")}>
                Explore with a Map
              </div>
            </div>
        </div>
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
