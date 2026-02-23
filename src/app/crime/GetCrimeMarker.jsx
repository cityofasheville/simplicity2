const GetCrimeMarker = (type) => {
	switch (type) {
		case "MISSING PERSON REPORT":
		case "RUNAWAY JUVENILE":
			return require("../../images/User.png");
		case "DAMAGE TO PERSONAL PROPERTY":
		case "DAMAGE TO PERSONAL PROPER":
		case "VANDALISM":
			return require("../../images/Hammer.png");
		case "ASSAULT - SIMPLE":
		case "ASSAULT ON FEMALE":
		case "ASSAULT W/DEADLY WEAPON":
		case "ASSAULT BY STRANGULATION":
			return require("../../images/Ambulance.png");
		case "COMMUNICATING THREAT":
			return require("../../images/Bubble.png");
		case "INTIMIDATING STATE WITNESS":
		case "PERJURY":
		case "OBSTRUCTION OF JUSTICE":
			return require("../../images/Library2.png");
		case "FRAUD":
		case "FRAUD-CREDIT CARD":
		case "FALSE PRETENSE - OBTAIN PROPERTY BY":
		case "IMPERSONATE":
			return require("../../images/Profile.png");
		case "CARRYING CONCEALED WEAPON":
			return require("../../images/Gun.png");
		case "RESIST, DELAY, OBSTRUCT OFFICER":
		case "CIT INCIDENT":
		case "DV ASSISTANCE OTHER":
		case "VICTIM ASSISTANCE OTHER":
		case "ASSAULT ON GOVERNMENT OFFICIAL":
			return require("../../images/Shield3.png");
		case "DWI":
		case "UNAUTHORIZED USE OF MOTOR VEHICLE":
		case "TRAFFIC OFFENSES - ALL OT":
			return require("../../images/Car.png");
		case "LARCENY OF MV OTHER":
		case "LARCENY OF MV AUTO":
		case "LARCENY OF MV TRUCK":
			return require("../../images/Car.png");
		case "TRESPASS":
			return require("../../images/Fence.png");
		case "INFORMATION ONLY":
			return require("../../images/Pencil7.png");
		case "DRUG PARAPHERNALIA POSSESS":
		case "DRUG OFFENSE - FELONY":
		case "DRUG OFFENSE - MISDEMEANOR":
		case "DRUG PARAPHERNALIA OTHER":
			return require("../../images/AidKit2.png");
		case "COUNTERFEITING-BUYING/RECEIVING":
			return require("../../images/BillDollar.png");
		case "LARCENY ALL OTHER":
		case "LARCENY FROM BUILDING":
		case "LARCENY FROM MOTOR VEHICLE":
		case "LARCENY FROM MOTOR VEHICL":
		case "ROBBERY - COMMON LAW":
		case "ROBBERY - ARMED - KNIFE":
			return require("../../images/Dollar.png");
		default:
			return require("../../images/Ellipsis.png");
	}
};

export default GetCrimeMarker;
