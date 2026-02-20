import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import moment from "moment";
import { Query } from "react-apollo";
import LoadingAnimation from "../../../shared/LoadingAnimation";
import PermitsMap from "./PermitsMap";
// import PermitSearchBar from './PermitSearchBar';
// import PermitSearchWrapper from "./PermitSearchWrapper";
import SuggestSearchWrapper from "../../search/SuggestSearchWrapper";
import PermitTimeline from "./PermitTimeline";
import { permitFieldFormats } from "./utils";
import { orderedDates } from "../trc/textContent";
import { getTRCTypeFromPermit } from "../trc/utils";
import { statusTranslation } from "../utils";
import Table from "../../../shared/Table/Table";

const GET_PERMIT = gql`
	query getPermitsQuery($permit_numbers: [String]) {
		permits(permit_numbers: $permit_numbers) {
			permit_number
			permit_group
			permit_type
			permit_subtype
			permit_category
			permit_description
			applicant_name
			application_name
			applied_date
			status_current
			status_date
			technical_contact_name
			technical_contact_email
			created_by
			building_value
			job_value
			total_project_valuation
			total_sq_feet
			fees
			paid
			balance
			invoiced_fee_total
			civic_address_id
			address
			x
			y
			contractor_names
			contractor_license_numbers
			internal_record_id
			comments {
				comment_date
				comment_seq_number
				comments
			}
			custom_fields {
				type
				name
				value
			}
			address_info {
				zoning
				zoning_links
			}
		}
	}
`;

const dateFormatter = (inputDate) => moment(new Date(inputDate)).format("MMMM DD, YYYY");

const Permit = (props) => (
	<Query
		query={GET_PERMIT}
		variables={{
			permit_numbers: [props.routeParams.id],
		}}
	>
		{({ loading, error, data }) => {
			if (loading) {
				return <LoadingAnimation />;
			}

			if (error) {
				console.log("GQL error");
				console.log(error);
				return (
					<div className="container">
						<h1 className="title__text">Permit Details</h1>
						<div className={`alert alert-danger`} style={{ margin: "2rem 0" }}>
							There was an error retrieving permit number "{props.routeParams.id}" - {error.message}. If this problem
							perists, please contact help@ashevillenc.gov.
						</div>
						<SuggestSearchWrapper searchMode="permit" />
					</div>
				);
			}

			if (data.permits === undefined || data.permits === null || data.permits.length === 0) {
				console.log("GQL returned no results");
				return (
					<div className="container">
						<h1 className="title__text">Permit Details</h1>
						<div className={`alert alert-warning`} style={{ margin: "2rem 0" }}>
							No permit found for ID "{props.routeParams.id}". Please verify the permit ID and try again.
						</div>
						<SuggestSearchWrapper searchMode="permit" />
					</div>
				);
			}

			if (data.permits !== undefined && data.permits.length > 1) {
				console.log("More than one permit found. This is not quite right: ", data);
			}

			const thisPermit = data.permits[0];
			const trcType = getTRCTypeFromPermit(thisPermit);
			const formattedPermit = Object.assign({}, thisPermit, { trcType });

			// These are all the "misc" info fields that may or may not be filled out for any permit
			thisPermit.custom_fields.forEach((customField) => {
				formattedPermit[customField.name] = customField.value;
			});

			formattedPermit.setbacks = [];
			if (formattedPermit.front && formattedPermit.front > 0) {
				formattedPermit.setbacks.push(`front: ${formattedPermit.front} feet`);
			}
			if (formattedPermit.corner_side && formattedPermit.corner_side > 0) {
				formattedPermit.setbacks.push(`side or corner: ${formattedPermit.corner_side} feet`);
			}
			if (formattedPermit.rear && formattedPermit.rear > 0) {
				formattedPermit.setbacks.push(`rear: ${formattedPermit.rear} feet`);
			}

			formattedPermit.orderedDates = orderedDates
				.filter((dateObject) => formattedPermit[dateObject.accelaLabel])
				.map((dateObject) =>
					Object.assign({}, dateObject, {
						dateInput: formattedPermit[dateObject.accelaLabel],
					})
				);

			// The popup is what you see when you click on the pin
			const mapData = [
				Object.assign({}, formattedPermit, {
					popup: `<b>${formattedPermit.address}</b>`,
				}),
			];
			// Don't show map if there are no coordinates
			const showMap = formattedPermit.y && formattedPermit.x;

			const accelaStatus = formattedPermit.status_current;
			const permitBalance = formattedPermit.balance;

			const currentStatusItem = statusTranslation.find((item) => item.accelaSpeak === formattedPermit.status_current);

			const byDetailArea = {};
			permitFieldFormats
				// If there is no display label, bring it to the top
				.sort((a) => (!a.displayLabel ? -1 : 0))
				.forEach((d) => {
					const val = formattedPermit[d.accelaLabel];
					// If current data record does not have a value for a particular permit field,
					// skip rest of this foreach callback and go to the next permit field
					if (!val) {
						return;
					}
					const formattedDisplayVal = d.formatFunc ? d.formatFunc(val, formattedPermit) : val;
					if (!formattedDisplayVal) {
						// Format functions return null if it should not show
						return;
					}
					if (!byDetailArea[d.displayGroup]) {
						byDetailArea[d.displayGroup] = [];
					}
					if (!d.displayLabel) {
						byDetailArea[d.displayGroup].push(
							<div className="permit-form-group bool bg-gray-100 p-4" key={d.accelaLabel}>
								{formattedDisplayVal}
							</div>
						);
					} else {
						byDetailArea[d.displayGroup].push(
							<div className="flex p-4 bg-gray-100" key={d.accelaLabel}>
								<div className="mr-auto">{d.displayLabel}</div>
								<div className="ml-auto">{formattedDisplayVal}</div>
							</div>
						);
					}
				});

			const catchAllACALink = `https://services.ashevillenc.gov/CitizenAccess/Cap/GlobalSearchResults.aspx?isNewQuery=yes&QueryText=${formattedPermit.permit_number}`;
			let acaLink = catchAllACALink;

			const internalRecordParts = formattedPermit.internal_record_id.split("-");

			if (internalRecordParts !== undefined && internalRecordParts.length === 3) {
				const baseCapURL = "https://services.ashevillenc.gov/CitizenAccess/Cap/CapDetail.aspx";
				if (
					formattedPermit.permit_group === "Permits" ||
					formattedPermit.permit_group === "Planning" ||
					formattedPermit.permit_group === "Planning"
				) {
					acaLink = `${baseCapURL}?Module=${formattedPermit.permit_group}&TabName=${formattedPermit.permit_group}&capID1=${internalRecordParts[0]}&capID2=${internalRecordParts[1]}&capID3=${internalRecordParts[2]}&agencyCode=ASHEVILLE`;
				}
			}

			const resubmittalPortal = "https://develop.ashevillenc.gov/revised-applicationamendment";

			function compareValues(key = "dateInput", order = "asc") {
				return function innerSort(a, b) {
					if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
						// if property doesn't exist on either object
						return 0;
					}

					const varA = new Date(a[key]);
					const varB = new Date(b[key]);

					let comparison = 0;
					if (varA > varB) {
						comparison = 1;
					} else if (varA < varB) {
						comparison = -1;
					}
					return order === "desc" ? comparison * -1 : comparison;
				};
			}

			formattedPermit.orderedDates.sort(compareValues());
			// console.log('formattedPermit.orderedDates', formattedPermit);
			// console.log('formattedPermit', formattedPermit)
			// console.log('currentStatusItem', currentStatusItem)
			console.log(data.permits[0].comments);

			const commentTableConfig = {
				columns: [
					{
						accessorKey: "comment_date",
						enableColumnFilter: true,

						cell: ({ row }) => <span>{row.original.comment_date}</span>,
						header: () => <span>Date</span>,
						footer: (props) => props.column.id,
						width: 100,
					},
					{
						accessorKey: "comments",
						enableColumnFilter: true,

						cell: (info) => info.getValue(),
						header: () => <span>Comment</span>,
						footer: (props) => props.column.id,
						width: 600,
					},
				],
				navigationRender: {
					paginationButtonsRender: false,
					goToPageRender: false,
					itemsPerPageRender: false,
					itemsPerPage: 20,
				},
				filterRender: {
					globalFilterRender: false,
				},
			};

			const commentTableColumns = commentTableConfig.columns;
			const navRender = commentTableConfig.navigationRender;
			const filterRender = commentTableConfig.filterRender;

			return (
				<div>
					<h1 className="text-4xl text-coa-blue-medium my-5">Permit Details</h1>
					<h2 className="text-3xl text-coa-blue-medium my-4">{formattedPermit.application_name}</h2>
					<p className="my-2">{formattedPermit.permit_description}</p>
					<p className="">{`City staff began processing this application on ${dateFormatter(
						formattedPermit.applied_date
					)}.  ${currentStatusItem ? currentStatusItem.statusText : ""}`}</p>
					{formattedPermit.orderedDates !== undefined &&
						formattedPermit.trcType &&
						formattedPermit.orderedDates.length > 0 && (
							<PermitTimeline
								formattedPermit={formattedPermit}
								dateFormatter={dateFormatter}
								currentStatusItem={currentStatusItem}
							/>
						)}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
						<div>
							{showMap && (
								<div className="h-[350px] w-full">
									<PermitsMap permitData={mapData} centerCoords={[formattedPermit.y, formattedPermit.x]} zoom={14} />
								</div>
							)}

							{byDetailArea["zoning details"] !== undefined && (
								<div>
									<h3 className="text-2xl text-coa-blue-medium my-5">Zoning Details</h3>
									<div className="flex flex-col gap-1">
										{byDetailArea["zoning details"].map((d) => {
											if (d.key === "Zoning District") {
												// zoning links are now provided by the backend, skipping the permitFieldFormats abstraction
												return (
													<div key={d.key} className="bg-gray-100 flex p-4">
														<div className="mr-auto">Zoning District</div>
														<div className="ml-auto">
															{/* 
                            zoning_links and zoning can be different lengths when split by commas
                            for example, when zoning_links is null, zoning may say "No zoning"
                            so we need to handle this case by checking if zoning_links exists
                          */}
															{formattedPermit.address_info?.zoning_links?.length &&
															formattedPermit.address_info?.zoning?.length
																? formattedPermit.address_info.zoning.split(",").map((zoning, index) => {
																		let prepend = index !== 0 ? ", " : "";
																		return (
																			<span key={`zoning=${index}`}>
																				{prepend}
																				<a
																					href={formattedPermit.address_info.zoning_links.split(",")[index]}
																					target="_blank"
																					rel="noopener noreferrer"
																				>
																					{zoning}
																				</a>
																			</span>
																		);
																  })
																: "No zoning"}
														</div>
													</div>
												);
											}
											return d;
										})}
									</div>
								</div>
							)}

							{byDetailArea["environment details"] !== undefined && (
								<div className="col-sm-12 col-md-6 permit-details-card">
									<h3 className="text-2xl text-coa-blue-medium my-5">Environmental Details</h3>
									{byDetailArea["environment details"].map((d) => d)}
								</div>
							)}
						</div>

						<div className="">
							<div className=" ">
								<div className="flex flex-col gap-1 justify-between">
									{byDetailArea["project details"] !== undefined && byDetailArea["project details"].map((d) => d)}

									{accelaStatus && (
										<div className="bg-gray-100 p-4 flex ">
											<div className="mr-auto">Current Status</div>
											<div className="ml-auto">
												<a href={acaLink} target="_blank" rel="noopener noreferrer">
													{accelaStatus}
												</a>
											</div>
										</div>
									)}
								</div>
							</div>

							<h3 className="text-2xl text-coa-blue-medium my-5">For Applicants: Work with this Application</h3>
							<div className="bg-gray-100 p-4">
								<ul className="list-disc mx-8 ">
									<li className="my-3">
										<a href={acaLink} target="_blank" rel="noopener noreferrer">
											Check application status details
										</a>
									</li>

									<li className="my-3">
										<a href={acaLink} target="_blank" rel="noopener noreferrer">
											Pay application fees
										</a>
										<br />
										{permitBalance
											? "There is an outstanding balance on this application"
											: "There is a zero balance on this application"}
									</li>

									<li className="my-3">
										<a href={acaLink} target="_blank" rel="noopener noreferrer">
											Pick up an approved application or review comments
										</a>
									</li>

									<li className="my-3">
										<a href={acaLink} target="_blank" rel="noopener noreferrer">
											Schedule an inspection (login required)
										</a>
									</li>

									<li className="my-3">
										<a href={resubmittalPortal} target="_blank" rel="noopener noreferrer">
											Submit updated documents or an amended application
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div>
						{data.permits[0].comments.length > 0 && (
							<div>
								<h3 className="text-2xl text-coa-blue-medium my-5">Comments</h3>
								<Table
									ariaLabel="Permit comments"
									navRender={navRender}
									data={data.permits[0].comments}
									filterRender={filterRender}
									columns={commentTableColumns}
									defaultPageSize={20}
									showPagination={true}
									className="w-full items-center"
									filterOptions={[]}
								/>
							</div>
						)}
					</div>
					{trcType !== undefined && (
						<div className="flex my-6">
							<p>
								<em>
									This is an application made for development or permitting by a private individual that is being
									reviewed by the City of Asheville.
									<a href="/development/major">Learn more</a> about the development review process in Asheville.
								</em>
							</p>
						</div>
					)}

					<hr />
					<div className=" mb-8">
						<h2 className="text-3xl text-coa-blue-medium mb-5 mt-6">Look Up Another Application</h2>
						<SuggestSearchWrapper searchMode="permit" autoFocusInput={false} />
					</div>
				</div>
			);
		}}
	</Query>
);

Permit.propTypes = {
	routeParams: PropTypes.shape({
		id: PropTypes.string,
	}),
};

Permit.defaultProps = {
	routeParams: {
		id: "",
	},
};

export default Permit;
