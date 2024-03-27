import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { Combobox } from '@headlessui/react';
import * as Ariakit from '@ariakit/react';
import { homePageQuery, searchQuery, suggestionsQuery, formatSearchResults, getIcon } from './searchResults/searchResultsUtils';
import useDebounce from '../../hooks/useDebounce';
// import DebouncedInput from './DebouncedInput';
import './styles.css';

const comboBoxStyle = {
  position: 'absolute',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '4px',
  listStyle: 'none',
  width: '100%',
  zIndex: 1000,
  // height: '250px',
  overflow: 'auto',
  // top: '42px',

};

const highlightedStyle = {
  backgroundColor: 'blue',
  color: 'yellow',
};

function SuggestSearch( {setUserQuery} ) {

  const combobox = Ariakit.useComboboxStore();

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const debouncedInputValue = useDebounce({ value: inputValue, delay: 500 });

  const inputRef = useRef(null);
  const formRef = useRef(null);
  const clearButtonRef = useRef(null);
  const submitButtonRef = useRef(null);

  // const triggerBottom = React.useMemo(
  //   () => trigger?.offsetTop + trigger?.offsetHeight + CONTENT_OFFSET,
  //   [trigger]
  // );

  let currentUrlParams = new URLSearchParams(window.location.search);
  let urlQuery = '';
  if (currentUrlParams.has('search')) {
    console.log('SuggestSearch query params:', currentUrlParams.get('search'));
    urlQuery = currentUrlParams.get('search');
    // setUserQuery(currentUrlParams.get('search'));
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (urlQuery.length > 2) {
      setInputValue(urlQuery);
      setUserQuery(urlQuery);
    }
  }, []);

  useEffect(() => {
    async function getSuggestions() {
      let newSuggestionSet = [];
      const encodedQuery = encodeURIComponent(debouncedInputValue);
      const geocoderEndpoint = `https://gis.ashevillenc.gov/server/rest/services/Geocoders/simplicity/GeocodeServer/suggest?text=${encodedQuery}&maxSuggestions=10&category=&countryCode=&searchExtent=&location=&distance=&f=pjson`;

      const simplicityEndpoint = 'https://data-api1.ashevillenc.gov/graphql';
      const simplicityOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationName: 'searchQuery',
          query: suggestionsQuery,
          variables: {
            searchContexts: ['neighborhood', 'street', 'owner'],
            searchString: debouncedInputValue,
          },
        }),
      };

      let [geocoderData, simplicityData] = await Promise.all([
        fetch(geocoderEndpoint).then((response) => response.json()),
        fetch(simplicityEndpoint, simplicityOptions).then((response) => response.json()),
      ]);

      // const geocoderResponse = await fetch(
      //   `https://gis.ashevillenc.gov/server/rest/services/Geocoders/simplicity/GeocodeServer/suggest?text=${encodedQuery}&maxSuggestions=10&category=&countryCode=&searchExtent=&location=&distance=&f=pjson`
      // );
      // const geocoderData = await geocoderResponse.json();

      // console.log('geocoder data: ', geocoderData.suggestions);
      newSuggestionSet = geocoderData.suggestions.map((suggestion) => {
        return {
          type: 'address',
          ...suggestion,
        };
      });

      // const simplicityResponse = await fetch(simplicityEndpoint, simplicityOptions);
      // const simplicityData = await simplicityResponse.json();

      simplicityData.data.search.forEach((resultSet) => {
        newSuggestionSet = [
          ...newSuggestionSet,
          ...resultSet.results
            .filter((result, index) => {
              return index < 10;
            })
            .map((result, index) => {
              let nameProperty = 'name';
              if (resultSet.type === 'owner') {
                nameProperty = 'ownerName';
              } else if (resultSet.type === 'street') {
                nameProperty = 'full_street_name';
              }
              return {
                type: resultSet.type,
                text: result[nameProperty],
                magicKey: `${index}${result[nameProperty]}`,
              };
            }),
        ];
      });

      console.log('API DATA:', simplicityData.data.search);
      console.log('newSuggestionSet:', newSuggestionSet);

      setSuggestions([...newSuggestionSet]);
    }
    if (debouncedInputValue.length < 3) {
      return;
    }
    if (status === 'loading') {
      return;
    }
    const isnum = /^\d+$/.test(debouncedInputValue);

    if (isnum) {
      console.log('All-numberic (PIN?) DETECTED');
      return;
    }

    getSuggestions();
    
  }, [debouncedInputValue]);

  function handleComboBoxChange(event) {
    if (event.target.value === null) {
      return;
    }
    console.log('combo box change detected', event.target.value);
    setInputValue(event.target.value);
    // setUserQuery(event.target.value);
  }

  function handleSelect(suggestion) {
    // setQuery(suggestion);
    currentUrlParams.set('search', suggestion);
    if (history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}${window.location.hash}`;
      window.history.pushState({path: newurl}, '', newurl);
    }
    setInputValue(suggestion);
    setUserQuery(suggestion);
    // setStatus('loading');
    // handleSubmit(suggestion);
  }

  function handleChange(event) {
    console.log('input change detected', event.target.value);
    setInputValue(event.target.value);
  }

  function handleClear() {
    console.log('clear detected');
    currentUrlParams.delete('search');
    if (history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}${window.location.hash}`;
      window.history.pushState({path: newurl}, '', newurl);
    }
    setInputValue('');
    setSuggestions([]);
    inputRef.current.focus();
  }

  function handleFormSubmission(event) {
    event.preventDefault();
    if (inputValue.length > 2) {
      // setStatus('loading');
      // handleSubmit(inputValue);
      currentUrlParams.set('search', inputValue);
      if (history.pushState) {
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}${window.location.hash}`;
        window.history.pushState({path: newurl}, '', newurl);
      }
      console.log('form submission detected');
      setUserQuery(inputValue);
    }
  }

  async function handleSubmit() {
    const endpoint = 'https://data-api1.ashevillenc.gov/graphql';
    // const endpoint = "https://data-api1.ashevillenc.gov/graphql";
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operationName: 'searchQuery',
        query: homePageQuery,
        variables: {
          searchContexts: ['address', 'civicAddressId', 'pin', 'property', 'neighborhood', 'street', 'owner'],
          searchString: userQuery,
        },
      }),
    };
    const response = await fetch(endpoint, options);
    const data = await response.json();
    const formattedResults = formatSearchResults(data.data.search);
    // console.log('API DATA:', formattedResults);
    setSearchResults(formattedResults);
    setStatus('idle');
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleFormSubmission}>
        <div className="input-group mb-3" style={{position: 'relative'}}>
          {/* <input className="form-control combobox" type="text" placeholder="e.g. 123 Main St" /> */}

          <Ariakit.Combobox
            store={combobox}
            placeholder="e.g. 123 Main St"
            className="form-control combobox position-relative"
            value={inputValue ? inputValue : ''}
            onChange={handleComboBoxChange}
            autoComplete="off"
            ref={inputRef}
          />
          {suggestions.length > 0 && (
            <Ariakit.ComboboxPopover 
              store={combobox} 
              gutter={4} 
              sameWidth 
              className="list-unstyled position-absolute w-100 bg-white border rounded shadow-sm"
              style={{
                ...comboBoxStyle,
                // The below variable is supplied, inline, by the Ariakit.ComboboxPopover component
                maxHeight: 'var(--popover-available-height)',
              }}
            >
              {suggestions.map((suggestion) => {
                return (
                  <Ariakit.ComboboxItem
                    className="combobox-item"
                    // style={active ? highlightedStyle : {}}
                    key={suggestion.magicKey}
                    onClick={() => handleSelect(suggestion.text)}
                    value={suggestion.text}
                    onKeyDown={(event) => {
                      if (event.key === 'Tab') {
                        setInputValue(suggestion.text);
                      }
                    }}
                  >
                    <div style={{display:'flex', alignItems: 'flex-end'}}>
                      <span className="offscreen">{suggestion.type}</span>
                      <span className="suggestion-icon" aria-hidden="true">{getIcon(suggestion.type, 16)}</span>
                      <span className="suggestion-text">{suggestion.text.toLowerCase()}</span>
                    </div>
                  </Ariakit.ComboboxItem>
                );
              })}
            </Ariakit.ComboboxPopover>
          )}

          
          <div className="input-group-btn">
            <button
              className="btn btn-primary"
              type="button"
              id="button-addon2"
              onClick={handleClear}
              ref={clearButtonRef}
              style={{borderRight: '2px solid #ccc'}}
            >
              X
            </button>
            <button className="btn btn-primary" type="submit" id="button-addon2">
              Search
            </button>
          </div>
        </div>
      </form>
      <div className="results">
        {/* {searchResults.length > 0 && (
          searchResults.map((resultGroup, index) => (
            <SearchResultGroup
              key={[resultGroup.label, index].join('_')}
              data={resultGroup}
            />
          ))
        )} */}
      </div>
    </div>
  );
}

export default SuggestSearch;