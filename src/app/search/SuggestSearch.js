import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { Combobox } from '@headlessui/react';
import * as Ariakit from '@ariakit/react';
import { homePageQuery, searchQuery, suggestionsQuery, formatSearchResults, getIcon } from './searchResults/searchResultsUtils';
import useDebounce from '../../hooks/useDebounce';
// import DebouncedInput from './DebouncedInput';
import './styles.css';

// This is a style object for the combobox popover. Seems to behave better when applied inline (as opposed to class)?
const comboBoxStyle = {
  position: 'absolute',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '4px',
  listStyle: 'none',
  width: '100%',
  zIndex: 1000,
  overflow: 'auto',
};

function SuggestSearch({
  setUserQuery,
  debounceInterval = 500,
  suggestionEntities = ['neighborhood', 'street', 'owner'],
  patternsToExcludeFromSuggestions = [/^\d+$/],
}) {

  const combobox = Ariakit.useComboboxStore();

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const debouncedInputValue = useDebounce({ value: inputValue, delay: debounceInterval });

  const inputRef = useRef(null);
  const formRef = useRef(null);
  const clearButtonRef = useRef(null);
  const submitButtonRef = useRef(null);

  let currentUrlParams = new URLSearchParams(window.location.search);
  let urlQuery = '';
  if (currentUrlParams.has('search')) {
    urlQuery = currentUrlParams.get('search');
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (urlQuery.length > 2) {
      setInputValue(urlQuery);
      setStatus('loading');
      setUserQuery(urlQuery);
    }
  }, []);

  useEffect(() => {

    const geocoderController = new AbortController();
    const geocoderSignal = geocoderController.signal;
    const simplicityController = new AbortController();
    const simplicitySignal = simplicityController.signal;

    async function getSuggestions() {

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
            searchContexts: suggestionEntities,
            searchString: debouncedInputValue,
          },
        }),
        signal: simplicitySignal,
      };

      let geocoderData, simplicityData;
      let newSuggestionSet = [];

      try {
        const t0 = performance.now();

        [geocoderData, simplicityData] = await Promise.all([
          fetch(geocoderEndpoint, {signal: geocoderSignal}).then((response) => response.json()),
          fetch(simplicityEndpoint, simplicityOptions).then((response) => response.json()),
        ]);

        const t1 = performance.now();
        console.log(`Suggestions took ${t1 - t0} milliseconds.`);
          
      } catch (error) {
        setStatus('error');
      }

      if (geocoderData?.suggestions) {
        newSuggestionSet = [
          ...newSuggestionSet,
          ...geocoderData?.suggestions?.map((suggestion) => {
          return {
            type: 'address',
            ...suggestion,
          };
        })];
      }

      if (simplicityData?.data?.search) {
        simplicityData?.data?.search?.forEach((resultSet) => {
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
      }

      setSuggestions([...newSuggestionSet]);
    }
    if (debouncedInputValue.length < 3) {
      return;
    }
    if (status === 'loading') {
      return;
    }

    let shouldSkip = false;
    patternsToExcludeFromSuggestions.forEach((pattern) => {
      if (pattern.test(debouncedInputValue.trim())) {
        shouldSkip = true;
      }
    });

    // const patternsToSkip = new RegExp(patternsToExcludeFromSuggestions.join("|"), "i");
    // const shouldSkip = patternsToSkip.test(debouncedInputValue.trim())

    // const isnum = /^\d+$/.test(debouncedInputValue.trim());

    if (shouldSkip) {
      console.log('Input excluded from suggestions');
      return;
    }

    getSuggestions();

    return () => {
      // clean up any in-progress fetch requests
      geocoderController.abort();
      simplicityController.abort();
    }
    
  }, [debouncedInputValue]);

  function handleComboBoxChange(event) {
    if (event.target.value === null) {
      return;
    }
    setStatus('pending');
    setInputValue(event.target.value);
  }

  function handleSelect(suggestion) {
    currentUrlParams.set('search', suggestion);
    if (history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}${window.location.hash}`;
      window.history.pushState({path: newurl}, '', newurl);
    }
    setInputValue(suggestion);
    setStatus('loading');
    setUserQuery(suggestion);
  }

  function handleClear() {
    currentUrlParams.delete('search');
    if (history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}${window.location.hash}`;
      window.history.pushState({path: newurl}, '', newurl);
    }
    setInputValue('');
    setStatus('idle');
    setSuggestions([]);
    inputRef.current.focus();
  }

  function handleFormSubmission(event) {
    event.preventDefault();
    if (inputValue.length > 2) {
      currentUrlParams.set('search', inputValue);
      if (history.pushState) {
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}${window.location.hash}`;
        window.history.pushState({path: newurl}, '', newurl);
      }
      console.log('form submission detected');
      submitButtonRef.current.focus();
      setStatus('loading');
      setUserQuery(inputValue);
    }
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleFormSubmission}>
        <div className="input-group mb-3" style={{position: 'relative'}}>
          <label htmlFor="searchBox" className="offscreen">Search terms</label>
          <Ariakit.Combobox
            store={combobox}
            placeholder="e.g. 123 Main St"
            className="form-control combobox position-relative"
            value={inputValue ? inputValue : ''}
            onChange={handleComboBoxChange}
            autoComplete="off"
            ref={inputRef}
            id="searchBox"
          />
          {suggestions.length > 0 && (
            <Ariakit.ComboboxPopover 
              store={combobox} 
              gutter={4} 
              sameWidth 
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
            <button ref={submitButtonRef} className="btn btn-primary" type="submit" id="button-addon2">
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SuggestSearch;