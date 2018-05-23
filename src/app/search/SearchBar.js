import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../shared/Icon';
import { IM_SEARCH } from '../../shared/iconConstants';
// import SearchByEntities from './searchByEntities/SearchByEntities';
import SearchResults from './searchResults/SearchResults';

// const getEntities = (selected) => {
//   let entityTypes = [];
//   if (selected !== undefined && selected.length > 0) {
//     entityTypes = selected.split(',');
//   }
//   const entities = [
//     { label: 'Addresses', type: 'address', checked: true },
//     { label: 'Properties', type: 'property', checked: true },
//     { label: 'Neighborhoods', type: 'neighborhood', checked: true },
//     { label: 'Streets', type: 'street', checked: true },
//     { label: 'Owners', type: 'owner', checked: true },
//     { label: 'Google places', type: 'google', checked: true },
//   ];
//   for (let entity of entities) {
//     if (entityTypes.indexOf(entity.type) === -1) {
//       entity.checked = false;
//     }
//   }
//   return entities;
// };

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
        <h2>Enter address for trash pickup day, property details, and more</h2>
        <form onSubmit={event => event.preventDefault()}>
          <div className="input-group">
            <label htmlFor="searchBox" className="offscreen">
              Search terms
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Search text..."
              defaultValue={this.state.searchTermToUse}
              onKeyUp={this.handleKeyUp}
              id="searchBox"
              name="searchBox"
              autoFocus
            />
            <span className="input-group-btn">
              <button
                className="btn btn-primary"
                type="button"
                aria-label="search"
                onClick={() => this.handleSearchClick(document.getElementById('searchBox').value)}
              >
                <Icon path={IM_SEARCH} size={16} />
              </button>
            </span>
          </div>
          <div>
            <h3 className="text-center" style={{ marginBottom: '20px' }}>
              <i>Or search by: owner, neighborhood, pin number, or street</i>
            </h3>
          </div>
          {/* <SearchByEntities entities={getEntities(this.props.selectedEntities)} location={this.props.location} /> */}
        </form>
        <SearchResults
          results={[]}
          searchText={this.state.searchTermToUse}
          location={this.props.location}
        />
      </div>
    );
  }
}

SearchBar.defaultProps = {
  entities: [
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
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
