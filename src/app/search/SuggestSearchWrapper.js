import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import SuggestSearch from './SuggestSearch';
import SearchResultGroup from './searchResults/SearchResultGroup';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { searchQuery, formatSearchResults } from './searchResults/searchResultsUtils';

function SuggestSearchWrapper() {
  const [userQuery, setUserQuery] = useState('');

  const permitFormat = /^\d{2}-\d{5,10}(s|S|pz|pZ|Pz|PZ){0,1}$/;
  const allNumericFormat = /^\d+$/;

  const isPermit = permitFormat.test(userQuery.trim());
  const isAllNumeric = allNumericFormat.test(userQuery.trim());

  let searchContexts;

  // console.log('userQuery', userQuery);

  if (isPermit) {
    searchContexts = ['permit'];
    // console.log('isPermit');
  } else if (isAllNumeric) {
    searchContexts = ['civicAddressId', 'pin'];
    // console.log('isAllNumeric');
  } else {
    // do we need the "property" context? is "pin" sufficient?
    // searchContexts = ['address', 'property', 'neighborhood', 'street', 'owner'];
    searchContexts = ['address', 'neighborhood', 'street', 'owner'];
    // console.log('is neither');
  }

  return (
    <div>
      <section style={{marginBottom: "32px", marginTop: "32px"}}>
        <SuggestSearch 
          setUserQuery={setUserQuery} 
          debounceInterval={100}
          suggestWithGeocoder={true}
          suggestWithSimplicity={true}
          simplicitySuggestValue='id'
          suggestionEntities={['neighborhood', 'street', 'owner']}
        />
      </section>

      {userQuery.length > 2 && (
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

            // console.log('raw data', data.search);
            // console.log('formattedResults', formattedResults);

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