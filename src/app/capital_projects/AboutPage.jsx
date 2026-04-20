import React, { useEffect } from "react";
import { iconDictionary } from "./CIPIcons";
import { Link } from "react-router";

function AboutPage(props) {
	let path;
	const previous = props.location?.state?.previousPath.split("/capital_projects")[1];
	if (previous) {
		path = "/capital_projects" + previous;
	} else {
		path = "/capital_projects";
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div>
			<div className="mt-4">
				<div>
					<div className="flex space-between my-12">
						<h1 className="text-4xl text-coa-blue-medium">About Capital Projects</h1>
						<Link to={path} className="btn btn-primary ml-auto">
							Back to Dashboard
						</Link>
					</div>

					<p className="my-6">
						<span className="font-semibold text-coa-blue-medium">What is a capital project?</span> Capital projects
						traditionally take the form of large-scale physical developments, such as buildings, streets and other
						infrastructure. However, a wide range of other projects also qualify for capital funding consideration, such
						as heavy duty vehicles and computer software.
					</p>
					<p className="my-6">
						<span className="font-semibold text-coa-blue-medium">Funding:</span> All projects within the City’s Capital
						Improvement Program (CIP) are funded with a mix of internal City resources and external resources such as
						grants and partnerships.{" "}
					</p>
					<ul className="list-disc pl-10 my-6">
						<li>
							<a href="https://www.ashevillenc.gov/department/finance/city-budget/">
								{" "}
								City’s Capital Improvement Program (CIP)
							</a>
						</li>
						<li>
							<a href="https://publicinput.com/ashevillebonds">Bond projects</a> are projects that are funded by the
							voter-approved 2016 and 2024 General Obligation Bond Referendums.
						</li>
						<li>
							<a href="https://publicinput.com/ashevillerecovers#tab-58846">Helene recovery projects</a> are funded
							primarily by federal and state disaster recovery programs.
						</li>
					</ul>

					<p>
						<span className="font-semibold text-coa-blue-medium">Project Types: </span>
						<span>
							<i
								className={`bi ${iconDictionary["Transportation & Infrastructure"]} text-xl ml-1 text-coa-blue-medium`}
							></i>
						</span>{" "}
						Transportation & Infrastructure{" "}
						<span>
							<i className={`bi ${iconDictionary["Housing Program"]} text-xl ml-1 text-coa-blue-medium`}></i>
						</span>{" "}
						Housing Program{" "}
						<span>
							<i className={`bi ${iconDictionary["Parks & Recreation"]} text-xl ml-1 text-coa-blue-medium`}></i>
						</span>{" "}
						Parks & Recreation{" "}
						<span>
							<i className={`bi ${iconDictionary["Water"]} text-xl ml-1 text-coa-blue-medium`}></i>
						</span>{" "}
						Water{" "}
						<span>
							<i className={`bi ${iconDictionary["Building Construction"]} text-xl ml-1 text-coa-blue-medium`}></i>
						</span>{" "}
						Building Construction{" "}
						<span>
							<i className={`bi ${iconDictionary["Other"]} text-xl ml-1 text-coa-blue-medium`}></i>
						</span>{" "}
						Other. Projects categorized as "Other" support facility upgrades and economic development initiatives.
					</p>

					<p className="my-6">
						<span className="font-semibold text-coa-blue-medium">Project Selection:</span> The City of Asheville has
						more demand for infrastructure projects than it has funds and staff capacity to execute them, which is why
						strategically sequencing projects is important. The City identifies potential capital improvement projects
						using technical assessments of infrastructure condition and need, as well as public input. Projects are
						evaluated and prioritized based upon many criteria, including:
					</p>
					<ul className="list-disc pl-10 mb-6">
						<li>Public safety</li>
						<li>Economic growth and sustainability</li>
						<li>Affordable housing and community development</li>
						<li>Quality of life</li>
						<li>Availability of outside funding sources</li>
						<li>Equity</li>
					</ul>

					<p className="italic">
						Please note: Current project budgets include prior year funding and may change throughout the life of the
						project.
					</p>
					<p className="italic">
						Ongoing programs and regular maintenance projects may not be represented in this dashboard. For a complete
						list including ongoing and maintenance projects within the City's General CIP, please view the CIP in the{" "}
						<a href="https://www.ashevillenc.gov/department/finance/city-budget/">current adopted budget</a>.{" "}
					</p>
				</div>
			</div>
		</div>
	);
}

export default AboutPage;
