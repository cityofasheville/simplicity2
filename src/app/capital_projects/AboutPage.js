import React, { useEffect, useState } from "react";
import { getIcon } from "./cip_utilities";

function AboutPage() {
  const paragraphStyle = {
    marginBottom: "24px",
    marginTop: "24px",
  };

  return (
    <div>
      <div style={{ marginTop: "15px" }}>
        <div>
          <h1 style={{ marginBottom: "50px", marginTop: "50px" }}>
            About Capital Projects
          </h1>
          <p style={paragraphStyle}>
            <span
              style={{
                fontWeight: "bold",
                color: "rgb(64, 119, 165)",
              }}
            >
              What is a capital project?
            </span>{" "}
            Capital projects traditionally take the form of large-scale physical
            developments, such as buildings, streets and other infrastructure.
            However, a wide range of other projects also qualify for capital
            funding consideration, such as heavy duty vehicles and computer
            software.
          </p>
          <p style={paragraphStyle}>
            <span
              style={{
                fontWeight: "bold",
                color: "rgb(64, 119, 165)",
              }}
            >
              Funding:
            </span>{" "}
            All projects within the City’s Capital Improvement Program (CIP) are
            funded with a mix of internal City resources and external resources
            such as grants and partnerships. B Bond projects are projects that
            are funded by the voter-approved 2024 and 2016 General Obligation
            Bond Referendums. Helene recovery projects are funded primarily by
            federal and state disaster recovery programs.{" "}
          </p>

          <p style={paragraphStyle}>
            <span
              style={{
                fontWeight: "bold",
                color: "rgb(64, 119, 165)",
              }}
            >
              Project Types:{" "}
            </span>
            <span>{getIcon("Transportation & Infrastructure")}</span>{" "}
            Transportation & Infrastructure{" "}
            <span>{getIcon("Housing Program")}</span> Housing Program{" "}
            <span>{getIcon("Parks & Recreation")}</span> Parks & Recreation{" "}
            <span>{getIcon("Water")}</span> Water{" "}
            <span>{getIcon("Building Construction")}</span> Building
            Construction <span>{getIcon("Entertainment Facilities")}</span>{" "}
            Entertainment Facilities <span>{getIcon("Other")}</span> Other.
            Projects categorized as "Other" support facility upgrades and
            economic development initiatives.
          </p>

          <p style={paragraphStyle}>
            <span
              style={{
                fontWeight: "bold",
                color: "rgb(64, 119, 165)",
              }}
            >
              Project Selection:
            </span>{" "}
            The City of Asheville has more demand for infrastructure projects
            than it has funds and staff capacity to execute them, which is why
            strategically sequencing projects is important. The City identifies
            potential capital improvement projects using technical assessments
            of infrastructure condition and need, as well as public input.
            Projects are evaluated and prioritized based upon many criteria,
            including:
          </p>
          <ul style={{ marginBottom: "24px" }}>
            <li>Public safety</li>
            <li>Economic growth and sustainability</li>
            <li>Affordable housing and community development</li>
            <li>Quality of life</li>
            <li>Availability of outside funding sources</li>
            <li>Equity</li>
          </ul>

          <p style={{ fontStyle: "italic" }}>
            Please note: Current project budgets include prior year funding and
            may change throughout the life of the project.
          </p>
          <p style={{ fontStyle: "italic" }}>
            Ongoing programs and regular maintenance projects may not be
            represented in this dashboard. For a complete list including ongoing
            and maintenance projects within the City's General CIP, please view
            the CIP in the{" "}
            <a href="https://www.ashevillenc.gov/department/finance/city-budget/">
              current adopted budget
            </a>
            .{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
