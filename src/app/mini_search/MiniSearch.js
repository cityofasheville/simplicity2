import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Icon from '../../shared/Icon';
import { IM_SEARCH } from '../../shared/iconConstants';
import SearchByEntities from '../search/searchByEntities/SearchByEntities';
import MiniResults from './MiniResults';
import { getSearchText } from '../search/graphql/searchQueries';
import { updateSearchText } from '../search/graphql/searchMutations';

let timeout = null;

const getEntities = (selected) => {
  let entityTypes = [];
  if (selected !== undefined && selected.length > 0) {
    entityTypes = selected.split(',');
  }
  const entities = [
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
  ];
  for (const entity of entities) {
    if (entityTypes.indexOf(entity.type) === -1) {
      entity.checked = false;
    }
  }
  return entities;
};

class MiniSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTermToUse: this.props.searchText.search || this.props.location.query.search,
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handleKeyUp(e) {
    this.setState({
      searchTermToUse: e.target.value,
    });
    e.persist();
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      this.props.updateSearchText({
        variables: {
          text: e.target.value,
        },
      });
    }, 500);
  }

  handleSearchClick(value) {
    this.setState({
      searchTermToUse: value,
    });
    this.props.updateSearchText({
      variables: {
        value,
      },
    });
  }

  render() {
    return (
      <div style={{ margin: '2% 0%', fontSize: '0.75em' }}>
        <h4>Check whether the address is within city limits</h4>
        <form onSubmit={event => event.preventDefault()}>
          <div className="input-group">
            <label htmlFor="searchBox" className="offscreen">
              Search terms
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={this.props.selectedEntity}
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
          <div style={{ display: 'none' }}>
            <SearchByEntities
              entities={getEntities(this.props.location.query.entities)}
              location={this.props.location}
            />
          </div>
        </form>
        <br />
        <MiniResults
          results={[]}
          searchText={this.state.searchTermToUse}
          location={this.props.location}
        />
      </div>
    );
  }
}

MiniSearch.defaultProps = {
  entities: [
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
  ],
  selectedEntities: '',
  selectedEntity: 'address',
  title: 'Check whether the address is within city limits',
};

MiniSearch.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, type: PropTypes.string, checked: PropTypes.bool })),
  text: PropTypes.string,
  onKeyUp: PropTypes.func,
  onSearchClick: PropTypes.func,
  selectedEntity: PropTypes.string,
  title: PropTypes.string,
};

export default compose(
  graphql(updateSearchText, { name: 'updateSearchText' }),
  graphql(getSearchText, {
    props: ({ data: { searchText } }) => ({
      searchText,
    }),
  })
)(MiniSearch);
