import Icon from "../../shared/Icon";
import {
	IM_SHIELD3,
	IM_USER,
	IM_LIBRARY2,
	IM_CAR,
	IM_FENCE,
	IM_PENCIL7,
	LI_BILL_DOLLAR,
	IM_COIN_DOLLAR,
	IM_AID_KIT2,
	IM_HAMMER,
	LI_AMBULANCE,
	IM_PROFILE,
	IM_BUBBLE9,
	IM_GUN_FORBIDDEN,
} from "../../shared/iconConstants";

function GetCrimeIcon(type, isExpanded) {
	switch (type) {
		case "MISSING PERSON REPORT":
		case "RUNAWAY JUVENILE":
			return <Icon ariaHidden={true} path={IM_USER} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "DAMAGE TO PERSONAL PROPERTY":
		case "DAMAGE TO PERSONAL PROPER":
		case "VANDALISM":
			return <Icon ariaHidden={true} path={IM_HAMMER} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "ASSAULT - SIMPLE":
		case "ASSAULT ON FEMALE":
		case "ASSAULT W/DEADLY WEAPON":
		case "ASSAULT BY STRANGULATION":
			return (
				<Icon
					ariaHidden={true}
					path={LI_AMBULANCE}
					size={24}
					viewBox="0 0 24 24"
					color={isExpanded ? "#fff" : "#4077a5"}
				/>
			);
		case "COMMUNICATING THREAT":
			return <Icon ariaHidden={true} path={IM_BUBBLE9} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "INTIMIDATING STATE WITNESS":
		case "PERJURY":
		case "OBSTRUCTION OF JUSTICE":
			return <Icon ariaHidden={true} path={IM_LIBRARY2} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "FRAUD":
		case "FRAUD-CREDIT CARD":
		case "FALSE PRETENSE - OBTAIN PROPERTY BY":
		case "IMPERSONATE":
			return <Icon ariaHidden={true} path={IM_PROFILE} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "CARRYING CONCEALED WEAPON":
			return <Icon ariaHidden={true} path={IM_GUN_FORBIDDEN} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "RESIST, DELAY, OBSTRUCT OFFICER":
		case "CIT INCIDENT":
		case "DV ASSISTANCE OTHER":
		case "VICTIM ASSISTANCE OTHER":
		case "ASSAULT ON GOVERNMENT OFFICIAL":
			return <Icon ariaHidden={true} path={IM_SHIELD3} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "DWI":
		case "UNAUTHORIZED USE OF MOTOR VEHICLE":
		case "TRAFFIC OFFENSES - ALL OT":
			return <Icon ariaHidden={true} path={IM_CAR} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "LARCENY OF MV OTHER":
		case "LARCENY OF MV AUTO":
		case "LARCENY OF MV TRUCK":
			return <Icon ariaHidden={true} path={IM_CAR} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "TRESPASS":
			return <Icon ariaHidden={true} path={IM_FENCE} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "INFORMATION ONLY":
			return <Icon ariaHidden={true} path={IM_PENCIL7} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "DRUG PARAPHERNALIA POSSESS":
		case "DRUG OFFENSE - FELONY":
		case "DRUG OFFENSE - MISDEMEANOR":
		case "DRUG PARAPHERNALIA OTHER":
			return <Icon ariaHidden={true} path={IM_AID_KIT2} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "COUNTERFEITING-BUYING/RECEIVING":
			return (
				<Icon
					ariaHidden={true}
					path={LI_BILL_DOLLAR}
					viewBox="0 0 24 24"
					size={24}
					color={isExpanded ? "#fff" : "#4077a5"}
				/>
			);
		case "LARCENY ALL OTHER":
		case "LARCENY SHOPLIFTING":
		case "LARCENY FROM BUILDING":
		case "LARCENY FROM MOTOR VEHICLE":
		case "LARCENY FROM MOTOR VEHICL":
		case "ROBBERY - COMMON LAW":
		case "ROBBERY - ARMED - KNIFE":
			return <Icon ariaHidden={true} path={IM_COIN_DOLLAR} size={24} color={isExpanded ? "#fff" : "#4077a5"} />;
		default:
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					transform="translate(0,4)"
					version="1.1"
					viewBox="0 0 16 16"
					width="24px"
					aria-hidden={true}
				>
					<g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
						<g fill={isExpanded ? "#fff" : "#4077a5"} transform="translate(-528.000000, -576.000000)">
							<path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" />
						</g>
					</g>
				</svg>
			); // eslint-disable-line
	}
}

export default GetCrimeIcon;
