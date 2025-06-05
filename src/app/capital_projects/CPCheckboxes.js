import React, { useState } from "react";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import { english } from "./english";
import { spanish } from "./spanish";
import { iconDictionary } from "./CIPIcons";
import { CIPcolors } from "./CIPColors";

const CPCheckboxes = (props) => {
  const [newValues, updateNewValues] = useState([]);

  // Set language
  const content = props.language.language === "Spanish" ? spanish : english;

  const DISPLAY_NAMES = {
    // DCREF: "Entertainment Facilities",
    Helene: "Helene Recovery",
    "Operating Budget": "Capital Improvement Plan",
  };

  function updateURL(url, values) {
    const baseUrl = location.pathname;
    const params = new URLSearchParams(url.split("?")[1]);
    const serializedArray = values.length > 1 ? values.join(",") : values;

    if (props.variableString === "categories") {
      params.set("categories", serializedArray);
    } else if (props.variableString === "types") {
      params.set("types", serializedArray);
    }

    const updatedURL = `${baseUrl}?${params.toString()}`;
    browserHistory.replace(updatedURL);
  }

  const getVisibleSelection = () => {
    const { selected, filter_variable } = props;
    if (selected.length === filter_variable.length) {
      return [...selected, "All"];
    }
    return selected;
  };

  const visibleSelection = getVisibleSelection();

  const handleCheckboxChange = (value) => {
    let updatedSelection = [...visibleSelection];

    if (value === "All") {
      if (!visibleSelection.includes("All")) {
        updatedSelection = [...props.filter_variable];
      } else {
        updatedSelection = [];
      }
    } else {
      if (updatedSelection.includes(value)) {
        updatedSelection = updatedSelection.filter((v) => v !== value);
      } else {
        updatedSelection.push(value);
      }
    }

    updateNewValues(updatedSelection);
    updateURL(
      location.href,
      updatedSelection.filter((e) => e !== "All"),
      props.variableString
    );
  };

 

  return (
    <div>
      <div className="checkboxGroup">
        {["All", ...props.filter_variable.filter((type) => type !== "All")].map(
          (type, index) => {
            let displayExtra;
            const isChecked = visibleSelection.includes(type);
            const label = DISPLAY_NAMES[type] || type; // Use mapped label or default
            if (props.variableString == "categories") {
               displayExtra = <i
              className={`bi ${iconDictionary[type]}`}
              style={{
                fontSize: "1rem",
                marginRight: "4px",
                color: "rgb(64, 119, 165)",
              }}
            ></i>
            } else if (props.variableString == "types" && label != "All") {
              displayExtra = <i
              className={`bi bi-circle-fill`}
              style={{
                fontSize: "1rem",
                marginRight: "4px",
                color: CIPcolors[type],
              }}
            ></i>
            }

            return (
              <label
                key={`checkbox_${type}_${index}`}
                style={{
                  display: "inline-block",
                  padding: "2px 5px",
                  margin: "2px",
                  borderRadius: "4px",
                  backgroundColor: isChecked ? "#d0ebff" : "transparent",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <input
                  type="checkbox"
                  value={type}
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(type)}
                  style={{ marginRight: "2px" }}
                />
                {displayExtra}
                {label}
              </label>
            );
          }
        )}
      </div>
    </div>
  );
};

CPCheckboxes.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  filter_variable: PropTypes.arrayOf(PropTypes.string),
  variableString: PropTypes.string,
  language: PropTypes.object,
};

export default withLanguage(CPCheckboxes);
