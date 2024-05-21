import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import SuggestSearch from './SuggestSearch';
import SearchResultGroup from './searchResults/SearchResultGroup';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { searchQuery, formatSearchResults } from './searchResults/searchResultsUtils';
// import { set } from 'd3-collection';

function SuggestSearchWrapper({
  searchMode = 'main',
  autoFocusInput = true,
  debounceInterval = 250
}) {

  const permitFormat = /^\d{2}-\d{5,10}(s|S|pz|pZ|Pz|PZ){0,1}$/;
  const allNumericFormat = /^\d+$/;

  const [userQueryChecked, setUserQueryChecked] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [isPermit, setIsPermit] = useState(permitFormat.test(userQuery.trim()));
  const [isAllNumeric, setIsAllNumeric] = useState(allNumericFormat.test(userQuery.trim()));
  const [searchContexts, setSearchContexts] = useState(
    searchMode === 'main' ? 
    ['address', 'neighborhood', 'street', 'owner'] :
    ['address']
  );

  useEffect(() => {
    const nextIsPermit = permitFormat.test(userQuery.trim());
    const nextIsAllNumeric = allNumericFormat.test(userQuery.trim());
    let nextSearchContexts;
    
    if (nextIsPermit) {
      nextSearchContexts = ['permit'];
    } else if (nextIsAllNumeric) {
      nextSearchContexts = ['civicAddressId', 'pin'];
    } else {
      if (searchMode === 'main') {
        nextSearchContexts = ['address', 'neighborhood', 'street', 'owner'];
      } else {
        nextSearchContexts = ['address'];
      }
    }
    setIsPermit(nextIsPermit);
    setIsAllNumeric(nextIsAllNumeric);
    setSearchContexts(nextSearchContexts);
    setUserQueryChecked(true);
  }, [userQuery]);

  return (
    <div>
      {searchMode === 'permit' && window.location.pathname.includes('permits/search') && (
        <h1 className="">Development &amp; Permit Search</h1>
      )}    

      <section style={{marginBottom: "32px", marginTop: "32px"}}>
        <SuggestSearch 
          setUserQuery={setUserQuery} 
          setUserQueryChecked={setUserQueryChecked}
          autoFocusInput={autoFocusInput}
          debounceInterval={debounceInterval}
          suggestWithGeocoder={true}
          suggestWithSimplicity={searchMode === 'main'}
          simplicitySuggestValue='id'
          suggestionEntities={['neighborhood', 'street', 'owner']}
        />
      </section>

      {userQuery.length > 2 && userQueryChecked && (
        <Query 
          query={searchQuery}
          errorPolicy="all"
          variables={{
            searchContexts: searchContexts,
            searchString: isPermit ? userQuery.toUpperCase() : userQuery,
          }}
        >
          {({ loading, error, data }) => {
            
            if (loading) {
              return <LoadingAnimation />;
            } 

            if (error) {
              return (
                <div className="alert alert-danger alert-sm">
                  <span style={{fontSize: '1.25rem'}}>
                    There was an error fetching results.
                  </span>
                  <hr style={{margin: '0'}} />
                  <p style={{marginTop: '12px'}}>
                    {error.graphQLErrors.map(({ message }, i) => (
                      <span key={i}>{message}</span>
                    ))}
                  </p>                
                </div>
              );
            } 

            const formattedResults = formatSearchResults(data.search);

            return (
              <div className="row">
                <div className="col-sm-12">
                  {
                    formattedResults.length > 0 &&
                    formattedResults.map((resultGroup, index) => (
                      <SearchResultGroup
                        key={[resultGroup.label, index].join('_')}
                        data={resultGroup}
                        searchText={userQuery}
                        searchMode={searchMode}
                      />
                    ))
                  }
                  {formattedResults.length === 0 &&
                    <div className="alert alert-warning alert-sm">
                      No results were found for "{userQuery}". Try a different search term and/or different search type selections.
                    </div>
                  }
                </div>
              </div>
            );
            
          }}
        </Query>
      )}
      
    </div>
  );
}

export default SuggestSearchWrapper;