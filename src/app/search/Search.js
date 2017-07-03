import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SearchBar from './SearchBar';
import SearchResults from './searchResults/SearchResults';

import { searchKeyUp } from './searchActions';


const searchJSON = [
  {
    label: 'Neighborhoods',
    type: 'neighborhood',
    results: [
      {
        id: 'Montford',
        type: 'neighborhood',
        label: 'Montford',
      },
    ],
  },
  {
    label: 'Streets',
    type: 'street',
    results: [
      {
        id: '9639856365,9639859244,9639952037,9639945921,9639947555,9649041105,9649040073,9649034433,9649035188,9649028801,9649120433,9649121245,9649113917,9649114812,9649116429,9649118163,9649109985',
        type: 'street',
        label: 'Montford Ave, 28801',
      },
      {
        id: '9639856365,9639859244,9639952037,9639945921,9639947555,9649035188,9649028801,9649120433,9649121245,9649113917,9649114812,9649116429,9649118163,9649109985',
        type: 'street',
        label: 'Test Street 28804',
      },
    ],
  },
  {
    label: 'Addresses',
    type: 'address',
    results: [
      {
        id: '24207',
        type: 'address',
        label: '22 Linden Ave, 28801',
      },
      {
        id: '24208',
        type: 'address',
        label: '64 MURDOCK AVE, 28801',
      },
      {
        id: '24209',
        type: 'address',
        label: '41 DONNA DR, 28801',
      },
      {
        id: '24210',
        type: 'address',
        label: '44 MARLOWE DR, 28801',
      },
      {
        id: '83867',
        type: 'address',
        label: '1 West ST, 28787',
      },
      {
        id: '24212',
        type: 'address',
        label: '42 Edwin PL, 28801',
      },
    ],
  },
  {
    label: 'Properties',
    type: 'property',
    results: [
      {
        id: '9999242070000',
        type: 'property',
        label: '22 Linden Ave UNIT',
      },
      {
        id: '9999242080000',
        type: 'property',
        label: '100 Main Street Unit',
      },
      {
        id: '9999242090000',
        type: 'property',
        label: '50 Haywood Ave Unit',
      },
      {
        id: '9999242100000',
        type: 'property',
        label: '16 Wall St Unit',
      },
      {
        id: '9999242110000',
        type: 'property',
        label: '53 Clingman Ave Unit',
      },
      {
        id: '9999242120000',
        type: 'property',
        label: '19 Lexington Ave Unit',
      },
    ],
  },
  {
    label: 'Owners',
    type: 'owner',
    results: [
      {
        id: '9999242070000',
        type: 'owner',
        label: 'John Doe',
      },
    ],
  },
];

class Search extends React.Component {

  // TODO: GraphQL/Redux needs to tie in here

  render() {
    return (
      <div>
        <div className="row">
          <SearchBar text={this.props.text} onKeyUp={this.props.onKeyUp} />
        </div>
        <SearchResults results={searchJSON} ></SearchResults>
      </div>
    );
  }
}


Search.propTypes = {
  text: PropTypes.string,
  onKeyUp: PropTypes.func,
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
