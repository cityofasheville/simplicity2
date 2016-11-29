/*
 *
 * SearchResultsPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Helmet from 'react-helmet';
// import messages from './searchResultsPageMessages';
// import styles from './searchResultsPageStyles.css';

export class SearchResultsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      results: [
        {
          title: 'Addresses',
          iconClass: 'fa fa-address-book',
          results: [
            {
              id: '1234',
              label: '22 Linden Ave',
            },
            {
              id: '1235',
              label: '23 Linden Ave',
            },
            {
              id: '1236',
              label: '24 Linden Ave',
            },
            {
              id: '1237',
              label: '25 Linden Ave',
            },
          ],
        },
        {
          title: 'Streets',
          iconClass: 'fa fa-road',
          results: [
            {
              id: '12',
              label: 'Linden Ave',
            },
            {
              id: '13',
              label: 'Linden St',
            },
            {
              id: '14',
              label: 'Linden Dr',
            },
          ],
        },
      ],
    };
  }

  render() {
    return (
      <div className="container">
        <Helmet
          title="SearchResultsPage"
          meta={[
            { name: 'description', content: 'Description of SearchResultsPage' },
          ]}
        />
        <div className="col-md-1 col-md-offset-11">
          <i className="fa fa-2x fa-close text-primary" onClick={browserHistory.goBack}></i>
        </div>

        <div className="col-md-8 col-md-offset-2">
          <form>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                onKeyUp={this.handleSearchOnKeyUp}
                autoFocus
                placeholder="Search for a location, name or ID..."
              />
              <span className="input-group-btn">
                <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
              </span>
            </div>
          </form>
          { this.state.results.map((group) => (
            <div key={group.title}>
              <h2 className="text-primary"><i className={group.iconClass}></i> {group.title}</h2>
              <div className="list-group">
              { group.results.map((result) => (
                <a className="list-group-item" key={result.id} href={result.id}>
                    {result.label}
                </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { searchResultsPage } = state;
  const props = {
    searchResultsPage,
    ownProps,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsPage);
