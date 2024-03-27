import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import SuggestSearch from './SuggestSearch';
import SearchResultGroup from './searchResults/SearchResultGroup';
import LoadingAnimation from '../../shared/LoadingAnimation';
import { searchQuery, formatSearchResults } from './searchResults/searchResultsUtils';

function SuggestSearchWrapper() {
  const [userQuery, setUserQuery] = useState('');

  return (
    <div>
      {/* <h1>WrappyWrap</h1> */}

      <section style={{marginBottom: "32px", marginTop: "32px"}}>
        <SuggestSearch 
          setUserQuery={setUserQuery} 
          debounceInterval={100}
          suggestionEntities={['neighborhood', 'street', 'owner']}
        />
      </section>

      {userQuery.length > 2 && (
        <Query 
          query={searchQuery}
          errorPolicy="all"
          variables={{
            searchContexts: ['address', 'civicAddressId', 'pin', 'property', 'neighborhood', 'street', 'owner'],
            searchString: userQuery,
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