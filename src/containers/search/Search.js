import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';

import { searchKeyUp } from './searchActions';


const searchJSON = [
  {
    label: 'Addresses',
    icon: 'fa-map-marker',
    results: [
      {
        id: '24207',
        type: 'address',
        label: '22 Linden Ave, 28801',
      },
      {
        id: '24208',
        type: 'address',
        label: '100 Main Street, 28804',
      },
      {
        id: '24209',
        type: 'address',
        label: '50 Haywood Ave, 28801',
      },
      {
        id: '24210',
        type: 'address',
        label: '16 Wall St, 28801',
      },
      {
        id: '24211',
        type: 'address',
        label: '53 Clingman Ave, 28801',
      },
      {
        id: '24212',
        type: 'address',
        label: '19 Lexington Ave, 28801',
      },
    ],
  },
  {
    label: 'Properties',
    icon: 'fa-home',
    results: [
      {
        id: '9999242070000',
        type: 'property',
        label: '22 Linden Ave, 28801',
      },
      {
        id: '9999242080000',
        type: 'property',
        label: '100 Main Street, 28804',
      },
      {
        id: '9999242090000',
        type: 'property',
        label: '50 Haywood Ave, 28801',
      },
      {
        id: '9999242100000',
        type: 'property',
        label: '16 Wall St, 28801',
      },
      {
        id: '9999242110000',
        type: 'property',
        label: '53 Clingman Ave, 28801',
      },
      {
        id: '9999242120000',
        type: 'property',
        label: '19 Lexington Ave, 28801',
      },
    ],
  },
];

class Search extends React.Component {

  // TODO: GraphQL/Redux needs to tie in here

  render() {
    return (
      <div className="search">
        <div className="container">
          <button onClick={browserHistory.goBack} className="search-close">&times;</button>
          <div className="search-bar-wrapper">
            <SearchBar text={this.props.text} onKeyUp={this.props.onKeyUp}/>
          </div>
          <SearchResults results={searchJSON} ></SearchResults>
        </div>
      </div>
    );
  }
}


Search.propTypes = {
  text: React.PropTypes.string,
  onKeyUp: React.PropTypes.func,
};

const mapStateToProps = (state, ownProps) => (
  {
    text: state.search.text,
  }
);

const mapDispatchToProps = dispatch => (
  {
    onKeyUp: event => (
      dispatch(searchKeyUp(event.target.value))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Search);
