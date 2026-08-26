import React, { useState, useEffect, useRef, useContext } from "react";
// import { Combobox } from '@headlessui/react';
import * as DOMPurify from "dompurify";
import * as Ariakit from "@ariakit/react";
import {
	homePageQuery,
	searchQuery,
	suggestionsQuery,
	formatSearchResults,
	getIcon,
} from "./searchResults/searchResultsUtils";
import useDebounce from "../../hooks/useDebounce";
import { ApiEnvironmentContext } from "../../routes";
import { IM_SEARCH } from "../../shared/iconConstants";
import Icon from "../../shared/Icon";
// import DebouncedInput from './DebouncedInput';
import "./styles.css";

// This is a style object for the combobox popover. Seems to behave better when applied inline (as opposed to class)?
const comboBoxStyle = {
	position: "absolute",
	backgroundColor: "white",
	border: "1px solid #ccc",
	borderRadius: "4px",
	listStyle: "none",
	width: "100%",
	zIndex: 1000,
	overflow: "auto",
};

function SuggestSearch({
	setUserQuery,
	// autoFocusInput = false,
	debounceInterval = 500,
	suggestWithGeocoder = true,
	suggestWithSimplicity = true,
	simplicitySuggestValue = "name",
	suggestionEntities = ["neighborhood", "street", "owner"],
	patternsToExcludeFromSuggestions = [/^\d+$/, /^\d+-?\d*$/],
}) {
	const combobox = Ariakit.useComboboxStore();

	const [inputDisplayValue, setInputDisplayValue] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [status, setStatus] = useState("idle");
	const debouncedInputValue = useDebounce({ value: inputValue, delay: debounceInterval });

	const inputRef = useRef(null);
	const formRef = useRef(null);
	const clearButtonRef = useRef(null);
	const submitButtonRef = useRef(null);

	const inputReplacePattern = /[{("')}]/g;
	let currentUrlParams = new URLSearchParams(window.location.search);
	let urlQuery = "";
	if (currentUrlParams.has("search")) {
		urlQuery = DOMPurify.sanitize(currentUrlParams.get("search"));
		// urlQuery = currentUrlParams.get('search');
	}

	const apiEnvironment = React.useContext(ApiEnvironmentContext);

	useEffect(() => {
		// if (inputRef.current && autoFocusInput) {
		//   inputRef.current.focus();
		// }
		if (urlQuery.length > 2) {
			setInputValue(urlQuery);
			setInputDisplayValue(urlQuery);
			setStatus("loading");
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
			const geocoderOptions = { signal: geocoderSignal };

			const simplicityEndpoint = apiEnvironment;
			const simplicityOptions = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					operationName: "searchQuery",
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
				// const t0 = performance.now();

				const suggestionPromises = [];

				if (suggestWithGeocoder) {
					suggestionPromises.push(fetch(geocoderEndpoint, geocoderOptions).then((response) => response.json()));
				}
				if (suggestWithSimplicity) {
					suggestionPromises.push(fetch(simplicityEndpoint, simplicityOptions).then((response) => response.json()));
				}

				// const suggestionResponses = await Promise.all(suggestionPromises);
				const suggestionResponses = await Promise.allSettled(suggestionPromises);

				// console.log('suggestionResponses', suggestionResponses);

				if (suggestWithGeocoder) {
					geocoderData = suggestionResponses[0].value;
				} else {
					geocoderData = { suggestions: [] };
				}

				if (suggestWithSimplicity) {
					simplicityData = suggestionResponses[suggestionResponses.length - 1].value;
				} else {
					simplicityData = { data: { search: [] } };
				}

				// const t1 = performance.now();
				// console.log(`Suggestions took ${t1 - t0} milliseconds.`);
			} catch (error) {
				setStatus("error");
			}

			if (geocoderData?.suggestions) {
				newSuggestionSet = [
					...newSuggestionSet,
					...geocoderData?.suggestions?.map((suggestion) => {
						return {
							type: "address",
							value: suggestion.text,
							...suggestion,
						};
					}),
				];
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
								let nameProperty = "name";
								let idProperty = "";
								if (resultSet.type === "owner") {
									nameProperty = "ownerName";
								} else if (resultSet.type === "street") {
									nameProperty = "full_street_name";
								} else if (resultSet.type === "address") {
									nameProperty = "address";
									idProperty = "civic_address_id";
								}
								return {
									type: resultSet.type,
									text: result[nameProperty].trim(),
									value:
										simplicitySuggestValue === "id" && idProperty !== ""
											? result[idProperty].trim()
											: result[nameProperty].trim(),
									magicKey: `${index}${result[nameProperty]}`,
								};
							}),
					];
				});
			}

			// console.log('newSuggestionSet', newSuggestionSet);

			setSuggestions([...newSuggestionSet]);
		}

		if (debouncedInputValue.length < 3) {
			return;
		}
		if (status === "loading") {
			return;
		}

		let shouldSkip = false;
		patternsToExcludeFromSuggestions.forEach((pattern) => {
			// console.log('Testing pattern', pattern, debouncedInputValue.trim(), pattern.test(debouncedInputValue.trim()));
			if (pattern.test(debouncedInputValue.trim())) {
				shouldSkip = true;
			}
		});

		// const patternsToSkip = new RegExp(patternsToExcludeFromSuggestions.join("|"), "i");
		// const shouldSkip = patternsToSkip.test(debouncedInputValue.trim())

		// const isnum = /^\d+$/.test(debouncedInputValue.trim());

		if (shouldSkip) {
			// console.log('Input excluded from suggestions');
			return;
		}

		getSuggestions();

		return () => {
			// clean up any in-progress fetch requests
			geocoderController.abort();
			simplicityController.abort();
		};
	}, [debouncedInputValue]);

	function handleComboBoxChange(event) {
		if (event.target.value === null) {
			return;
		}
		const sanitizedInput = DOMPurify.sanitize(event.target.value).replace(inputReplacePattern, "");
		// console.log(event.target.value, sanitizedInput);
		setStatus("pending");
		setInputValue(sanitizedInput);
		setInputDisplayValue(sanitizedInput);
	}

	function handleSelect(suggestion) {
		currentUrlParams.set("search", suggestion.value);
		if (history.pushState) {
			const newurl =
				window.location.protocol +
				"//" +
				window.location.host +
				window.location.pathname +
				`?${currentUrlParams}${window.location.hash}`;
			window.history.pushState({ path: newurl }, "", newurl);
		}
		setInputValue(suggestion.value);
		setInputDisplayValue(suggestion.text);
		setStatus("loading");
		setUserQuery(suggestion.value);
	}

	function handleClear() {
		currentUrlParams.delete("search");
		if (history.pushState) {
			const newurl =
				window.location.protocol +
				"//" +
				window.location.host +
				window.location.pathname +
				`?${currentUrlParams}${window.location.hash}`;
			window.history.pushState({ path: newurl }, "", newurl);
		}
		setInputValue("");
		setInputDisplayValue("");
		setStatus("idle");
		setSuggestions([]);
		inputRef.current.focus();
	}

	function handleFormSubmission(event) {
		const sanitizedInput = DOMPurify.sanitize(inputValue).replace(inputReplacePattern, "");
		event.preventDefault();
		if (sanitizedInput.length > 2) {
			currentUrlParams.set("search", sanitizedInput);
			if (history.pushState) {
				const newurl =
					window.location.protocol +
					"//" +
					window.location.host +
					window.location.pathname +
					`?${currentUrlParams}${window.location.hash}`;
				window.history.pushState({ path: newurl }, "", newurl);
			}
			// console.log('form submission detected');
			submitButtonRef.current.focus();
			setStatus("loading");
			setUserQuery(sanitizedInput);
		}
	}
	// form-control combobox position-relative

	return (
		<div>
			<form ref={formRef} onSubmit={handleFormSubmission}>
				<div className="mb-3 relative">
					<label htmlFor="searchBox" className="sr-only">
						Search terms
					</label>
					<div className="flex w-full>">
						<Ariakit.Combobox
							store={combobox}
							placeholder="e.g. 123 Main St"
							className="flex-1 border-2 border-blue-100 p-1"
							value={inputDisplayValue ? inputDisplayValue : ""}
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
								className="border-2 border-gray-100 border-1 rounded"
								style={{
									...comboBoxStyle,
									// The below variable is supplied, inline, by the Ariakit.ComboboxPopover component
									maxHeight: "var(--popover-available-height)",
								}}
							>
								{suggestions.map((suggestion) => {
									return (
										<Ariakit.ComboboxItem
											className="combobox-item p-2 focus:bg-coa-blue-light hover:bg-blue-50 bg-white"
											key={suggestion.magicKey}
											onClick={() => handleSelect(suggestion)}
											value={suggestion.text}
											onKeyDown={(event) => {
												if (event.key === "Tab") {
													setInputValue(suggestion.value);
												}
											}}
										>
											<div>
												<span className="sr-only">{suggestion.type}</span>
												<span className="text-coa-blue-medium" aria-hidden="true">
													{getIcon(suggestion.type, 16)}
												</span>
												<span className="suggestion-text">{suggestion.text.toLowerCase()}</span>
											</div>
										</Ariakit.ComboboxItem>
									);
								})}
							</Ariakit.ComboboxPopover>
						)}

						<div className="flex">
							<button
								className="bg-coa-blue-medium text-white px-4 py-2"
								type="button"
								id="button-addon2"
								onClick={handleClear}
								ref={clearButtonRef}
							>
								X
							</button>
							<button
								ref={submitButtonRef}
								className="flex justify-center items-center border-l border-white bg-coa-blue-medium text-white px-4 py-2 rounded-r"
								type="submit"
								id="button-addon3"
							>
								<Icon ariaHidden={true} path={IM_SEARCH} size={16} />
								<span className="sr-only">Submit search</span>
								<span className="hidden sm:inline sm:ml-2">Search</span>
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}

export default SuggestSearch;
