import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import DetailsIconLinkFormGroup from "../../shared/DetailsIconLinkFormGroup";
import TopicCard from "../../shared/TopicCard";
import Icon from "../../shared/Icon";
import Map from "../../shared/visualization/Map";
import { IM_ENVELOP3, IM_USERS, IM_HOME2 } from "../../shared/iconConstants";
import ButtonGroup from "../../shared/ButtonGroup";
import LinkButton from "../../shared/LinkButton";
import PageHeader from "../../shared/PageHeader";
import NeighborhoodPicker from "./NeighborhoodPicker";
import { getBoundsFromPolygonData, combinePolygonsFromNeighborhoodList } from "../../utilities/mapUtilities";
import { colorSchemes } from "../../shared/visualization/colorSchemes";

// list hoods underneath when multiple

const MULTI_VIEW_COLOR_SCHEME = colorSchemes.bright_colors;
const legacy_neighborhood_ids = ["NBHD12", "NBHD14", "NBHD96", "NBHD61", "NBHD60", "NBHD17", "NBHD55", "NBHD92"];

const SHOW_SINGLE = "single";
const SHOW_ALL = "all";
const SHOW_LEGACY = "legacy";

// Explicit `show` wins; single requires an id, otherwise fall back to all.
const getShowMode = (query) => {
	const id = query.id && query.id.trim();
	if (query.show === SHOW_LEGACY) return SHOW_LEGACY;
	if (query.show === SHOW_ALL) return SHOW_ALL;
	return id ? SHOW_SINGLE : SHOW_ALL;
};

const getNeighborhoodIds = (query) => {
	const mode = getShowMode(query);
	if (mode === SHOW_SINGLE) return [query.id.trim()];
	if (mode === SHOW_LEGACY) return legacy_neighborhood_ids;
	return [];
};

function Neighborhood(props) {
	if (props.data.loading) {
		// eslint-disable-line react/prop-types
		return <LoadingAnimation />;
	}
	if (props.data.error) {
		// eslint-disable-line react/prop-types
		return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
	}

	const neighborhoods = props.data.neighborhoods || [];
	if (neighborhoods.length === 0) {
		return <Error message="No neighborhoods found" />;
	}

	const mode = getShowMode(props.location.query);
	const isSingle = mode === SHOW_SINGLE;
	const heading = isSingle
		? neighborhoods[0].name
		: mode === SHOW_LEGACY
			? "Legacy Neighborhoods"
			: "Asheville Neighborhoods";

	const detailsURLBase = [
		"?entity=",
		props.location.query.entity,
		"&id=",
		props.location.query.id,
		"&entities=",
		props.location.query.entities,
		"&label=",
		props.location.query.label,
		"&search=",
		props.location.query.search,
		"&hideNavbar=",
		props.location.query.hideNavbar,
		"&view=list",
	].join("");

	const polygonData = combinePolygonsFromNeighborhoodList(neighborhoods, {
		showPopup: true,
		linkParams: {
			entities: props.location.query.entities,
			search: props.location.query.search,
			hideNavbar: props.location.query.hideNavbar,
		},
	});
	// Single view keeps the Map defaults; multi views cycle through the scheme.
	if (!isSingle) {
		polygonData.forEach((poly, i) => {
			const c = MULTI_VIEW_COLOR_SCHEME[i % MULTI_VIEW_COLOR_SCHEME.length];
			poly.color = c;
			poly.fillColor = c;
		});
	}

	return (
		<div>
			<PageHeader
				h1={heading}
				dataType={isSingle ? "Neighborhood" : "Neighborhoods"}
				// h2={isSingle ? "About this neighborhood" : "About these neighborhoods"}
				icon={<Icon ariaHidden={true} path={IM_USERS} size={50} />}
			>
				<div className="w-full flex justify-end items-center">
					<div className="btn-group ml-auto">
						<LinkButton
							className="btn btn-primary btn-sm"
							pathname="/search"
							query={{
								entities: props.location.query.entities,
								search: props.location.query.search,
								hideNavbar: props.location.query.hideNavbar,
							}}
						>
							Back to search
						</LinkButton>
					</div>
				</div>
			</PageHeader>
			<section className="bg-gray-50 p-4 ">
				<div className="mb-4 w-full max-w-md">
					<NeighborhoodPicker query={props.location.query} />
				</div>
				<div className="w-full h-[600px] flex mb-4">
					<Map
						drawPolygon
						// showPolygonLabels={mode === "legacy"}
						polygonData={polygonData}
						bounds={getBoundsFromPolygonData(neighborhoods.map((n) => n.polygon))}
					/>
				</div>
				{isSingle && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DetailsIconLinkFormGroup
							label="Address & Owner Mailing Lists"
							icon={<Icon ariaHidden={true} path={IM_ENVELOP3} size={24} />}
							href={`address/addressList${detailsURLBase}`}
							title="Address & Owner Mailing Lists"
							inWindow
						/>
						<DetailsIconLinkFormGroup
							label="Properties"
							icon={<Icon ariaHidden={true} path={IM_HOME2} size={24} />}
							href={`property/properties${detailsURLBase}`}
							title="Properties"
							inWindow
						/>
						{["CRIME", "DEVELOPMENT"].map((topic, i) => (
							<div key={["topic", i].join("_")}>
								<TopicCard
									topic={topic}
									entity="neighborhood"
									id={props.location.query.id}
									label={props.location.query.label}
									entities={props.location.query.entities}
									search={props.location.query.search}
								/>
							</div>
						))}
					</div>
				)}
				{mode === "legacy" && (
					<div>
						<p>
							Note: a legacy neighborhood is a historic or long-standing community, often historically under-resourced
							or impacted by displacement, whose residents organize to build collective power and drive civic
							engagement.
						</p>
					</div>
				)}
			</section>
		</div>
	);
}

const getNeighborhoodQuery = gql`
	query getNeighborhood($nbrhd_ids: [String]) {
		neighborhoods(nbrhd_ids: $nbrhd_ids) {
			name
			nbhd_id
			polygon {
				outer {
					points {
						x
						y
					}
				}
				holes {
					points {
						x
						y
					}
				}
			}
		}
	}
`;

const NeighborhoodQGL = graphql(getNeighborhoodQuery, {
	options: (ownProps) => ({
		variables: {
			nbrhd_ids: getNeighborhoodIds(ownProps.location.query),
		},
	}),
})(Neighborhood);

export default NeighborhoodQGL;
