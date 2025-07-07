import React, {useEffect} from "react";
import { iconDictionary } from "./CIPIcons";
import { Link } from "react-router";

function AboutPage(props) {
  const paragraphStyle = {
    marginBottom: "24px",
    marginTop: "24px",
  };

  let path;
  const previous =
    props.location?.state?.previousPath.split("/capital_projects")[1];
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
      <div style={{ marginTop: "15px" }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "50px",
              marginBottom: "50px",
            }}
          >
            <h1>About Capital Projects</h1>
            <Link to={path} className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>

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
            such as grants and partnerships.{" "}
          </p>
          <ul>
            <li><a href="https://www.ashevillenc.gov/department/finance/city-budget/"> City’s Capital Improvement Program (CIP)</a></li>
            <li><a href="https://publicinput.com/ashevillebonds">Bond projects</a> are projects that are funded by the voter-approved 2016 and 2024 General Obligation Bond Referendums.</li>
            <li><a href="https://publicinput.com/ashevillerecovers#tab-58846">Helene recovery projects</a> are funded primarily by federal and state disaster recovery programs.</li>
          </ul>

          <p style={paragraphStyle}>
            <span
              style={{
                fontWeight: "bold",
                color: "rgb(64, 119, 165)",
              }}
            >
              Project Types:{" "}
            </span>
            <span>
              <i
                className={`bi ${iconDictionary["Transportation & Infrastructure"]}`}
                style={{
                  transform: "rotate(135deg)",
                  fontSize: "1.25rem",
                  marginLeft: "6.5px",
                  color: "rgb(64, 119, 165)",
                }}
              ></i>
            </span>{" "}
            Transportation & Infrastructure{" "}
            <span>
              <i
                className={`bi ${iconDictionary["Housing Program"]}`}
                style={{
                  transform: "rotate(135deg)",
                  fontSize: "1.25rem",
                  marginLeft: "6.5px",
                  color: "rgb(64, 119, 165)",
                }}
              ></i>
            </span>{" "}
            Housing Program{" "}
            <span>
              <i
                className={`bi ${iconDictionary["Parks & Recreation"]}`}
                style={{
                  transform: "rotate(135deg)",
                  fontSize: "1.25rem",
                  marginLeft: "6.5px",
                  color: "rgb(64, 119, 165)",
                }}
              ></i>
            </span>{" "}
            Parks & Recreation{" "}
            <span>
              <i
                className={`bi ${iconDictionary["Water"]}`}
                style={{
                  transform: "rotate(135deg)",
                  fontSize: "1.25rem",
                  marginLeft: "6.5px",
                  color: "rgb(64, 119, 165)",
                }}
              ></i>
            </span>{" "}
            Water{" "}
            <span>
              <i
                className={`bi ${iconDictionary["Building Construction"]}`}
                style={{
                  transform: "rotate(135deg)",
                  fontSize: "1.25rem",
                  marginLeft: "6.5px",
                  color: "rgb(64, 119, 165)",
                }}
              ></i>
            </span>{" "}
            Building Construction{" "}
            <span>
              <i
                className={`bi ${iconDictionary["Other"]}`}
                style={{
                  transform: "rotate(135deg)",
                  fontSize: "1.25rem",
                  marginLeft: "6.5px",
                  color: "rgb(64, 119, 165)",
                }}
              ></i>
            </span>{" "}
            Other. Projects categorized as "Other" support facility upgrades and
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
