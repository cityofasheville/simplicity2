import React, { useState, useEffect, useRef } from 'react';
import { Combobox } from '@headlessui/react';
import { homePageQuery, searchQuery, suggestionsQuery, formatSearchResults } from './searchResults/searchResultsUtils';
import useDebounce from '../../hooks/useDebounce';
// import DebouncedInput from './DebouncedInput';

const comboBoxStyle = {
  position: 'absolute',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '4px',
  listStyle: 'none',
  width: '100%',
  zIndex: 1000,
  height: '250px',
  overflow: 'auto',
  top: '42px',
};

const highlightedStyle = {
  backgroundColor: 'blue',
  color: 'yellow',
};

function SuggestSearch( {setUserQuery} ) {

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const debouncedInputValue = useDebounce({ value: inputValue, delay: 500 });

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
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
      newSuggestionSet = [{
        type: 'user',
        text: debouncedInputValue,
        magicKey: `${debouncedInputValue}_0`,
      }, ...geocoderData.suggestions.map((suggestion) => {
        return {
          type: 'address',
          ...suggestion,
        };
      })];

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
    // if (parseInt(debouncedInputValue) !== NaN) {
    //   console.log('PIN DETECTED');
    //   return;
    // }

    getSuggestions();
    
  }, [debouncedInputValue]);

  function handleComboBoxChange(value) {
    if (value === null) {
      return;
    }
    console.log('combo box change detected', value);
    setInputValue(value.text);
    setUserQuery(value.text);
  }

  function handleChange(event) {
    console.log('input change detected', event.target.value);
    setInputValue(event.target.value);
  }

  function handleClear() {
    console.log('clear detected');
    setInputValue('');
    setSuggestions([]);
    inputRef.current.focus();
  }

  function handleFormSubmission(event) {
    event.preventDefault();
    if (inputValue.length > 2) {
      // setStatus('loading');
      // handleSubmit(inputValue);
      console.log('form submission detected');
      setUserQuery(inputValue);
    }
  }

  async function handleSubmit(userQuery) {
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
    console.log('API DATA:', formattedResults);
    setSearchResults(formattedResults);
    setStatus('idle');
  }


  return (
    <div>
      <form onSubmit={handleFormSubmission}>
        <div className="input-group mb-3">
          {/* <input className="form-control combobox" type="text" placeholder="e.g. 123 Main St" /> */}


          <Combobox
            // value={value_rhf ? value_rhf : ''}
            onChange={handleComboBoxChange}
            open={true}
            as="div"
            multiple={false}
            nullable={true}
          >
            {/* <Combobox.Label>
              Field Label
            </Combobox.Label> */}
            <div className="position-relative">
              <Combobox.Input
                
                onChange={handleChange}
                // onBlur={onBlur_rhf}
                className="form-control combobox position-relative"
                value={inputValue ? inputValue : ''}
                displayValue={inputValue ? inputValue : ''}
                // name={fieldInputName}
                autoComplete="off"
                ref={inputRef}
              />
              <div style={{position: 'relative'}}>
                {suggestions.length > 0 && (
                  <Combobox.Options
                  className="list-unstyled position-absolute w-100 bg-white border rounded shadow-sm"
                  style={comboBoxStyle}
                  >
                    {suggestions.map((suggestion) => (
                      /* Use the `active` state to conditionally style the active option. */
                      /* Use the `selected` state to conditionally style the selected option. */
                      <Combobox.Option key={suggestion.magicKey} value={suggestion} as={React.Fragment} data-suggestion={suggestion.text}>
                        {({ active, selected }) => (
                          <li
                            className={`d-flex ${active ? 'bg-dark text-light' : 'bg-white text-dark'} ${
                              selected ? 'border-left' : ''
                            }`}
                            style={active ? highlightedStyle : {}}
                          >
                            {selected ? (
                              <div className="py-1 d-flex align-items-center justify-content-center pl-2 mr-2 bg-success">
                                {/* <i className="fa fa-lg fa-check mr-2 bg-dark"></i> */}
                              </div>
                            ) : (
                              <div className="py-1 d-flex align-items-center justify-content-center pl-2 mr-2">
                                {/* <i className="fa fa-lg fa-times mr-2"></i> */}
                              </div>
                            )}
                            <div className="py-1 d-inline-block">
                              {suggestion.text}
                              <br />
                              <small>{suggestion.type}</small>
                            </div>
                          </li>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </div>
          </Combobox>


          <div className="input-group-btn">
            <button
              className="btn btn-primary"
              type="button"
              id="button-addon2"
              onClick={handleClear}
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