import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '../../shared/Icon';
import { IM_SEARCH } from '../../shared/iconConstants';
import SearchByEntities from './searchByEntities/SearchByEntities';
import SearchResults from './searchResults/SearchResults';

const getEntities = (selected) => {
  let entityTypes = [];
  if (selected !== undefined && selected.length > 0) {
    entityTypes = selected.split(',');
  }
  const entities = [
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    //{ label: 'Google places', type: 'google', checked: true }]
  ];
  for (let entity of entities) {
    if (entityTypes.indexOf(entity.type) === -1) {
      entity.checked = false;
    }
  }
  return entities;
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { searchTermToUse: this.props.text };
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handleKeyUp(e) {
    this.setState({
      searchTermToUse: e.target.value,
    });
    this.props.onKeyUp(e);
  }

  handleSearchClick(value) {
    this.setState({
      searchTermToUse: value,
    });
    this.props.onSearchClick(value);
  }

  render() {
    return (
      <div className="col-xs-12">
        <h1>Discover city data about <strong>places</strong> in your community.</h1>
        <form onSubmit={event => event.preventDefault()}>
          <div className="input-group">
            <label htmlFor="searchBox" className="offscreen">Search terms</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a keyword..."
              defaultValue={this.state.searchTermToUse}
              onKeyUp={this.handleKeyUp}
              id="searchBox"
              name="searchBox"
              autoFocus
            />
            <span className="input-group-btn">
              <button className="btn btn-primary" type="button" aria-label="search" onClick={() => this.handleSearchClick(document.getElementById('searchBox').value)}><Icon path={IM_SEARCH} size={16} /></button>
            </span>
          </div>
          <SearchByEntities entities={getEntities(this.props.selectedEntities)} location={this.props.location} />
        </form>
        <SearchResults results={[]} searchText={this.state.searchTermToUse} location={this.props.location}></SearchResults>
      </div>
    );
  }
}

SearchBar.defaultProps = {
  entities: [
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    //{ label: 'Google places', type: 'google', checked: true },
  ],
  selectedEntities: '',
};

SearchBar.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, type: PropTypes.string, checked: PropTypes.bool })),
  text: PropTypes.string,
  onKeyUp: PropTypes.func,
  onSearchClick: PropTypes.func,
};

export default SearchBar;
