import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import Icon from "./Icon";
import { IM_DOWNLOAD7 } from "./iconConstants";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import { withLanguage } from "../utilities/lang/LanguageContext";

const spanish = {
	Email: "Mandar correo electr\xF3",
	Download: "Descargar",
};

const english = {
	Email: "Email",
	Download: "Download",
};

const translate = (value, language) => {
	switch (language) {
		case "Spanish":
			return spanish[value];
		case "English":
			return english[value];
		default:
			return value;
	}
};

const EmailDownload = (props) => (
	<CSVLink className={props.className} data={props.downloadData} filename={props.fileName || "data.csv"}>
		<span className="btn btn-sm btn-success block inline">
			<Icon ariaHidden={true} path={IM_DOWNLOAD7} /> {translate("Download", props.language.language)}
		</span>
	</CSVLink>
);

EmailDownload.propTypes = {
	emailFunction: PropTypes.func,
	downloadData: PropTypes.array,
	fileName: PropTypes.string,
	lang: PropTypes.string,
};

EmailDownload.defaultProps = {
	emailFunction: null,
	downloadData: [],
	lang: "English",
};

export default withLanguage(EmailDownload);
