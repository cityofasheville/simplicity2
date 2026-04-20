import React, { useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
// import "../styles/components/disclaimer.scss";
import { useState } from "react";

function Disclaimer({ onAccept }) {
	const [isOpen, setIsOpen] = useState(true);

	const handleAccept = () => {
		setIsOpen(false);
		onAccept();
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<AlertDialog.Root open={isOpen} defaultOpen={true}>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="z-[9998] backdrop-blur-sm blur-sm fixed inset-0 bg-black/10" />
				<AlertDialog.Content className="z-[9999] bg-white rounded w-[90vw] max-w-[500px] max-h-[85vh] fixed top-1/2 left-1/2 p-6  -translate-x-1/2 -translate-y-1/2 shadow-lg">
					<AlertDialog.Title className="AlertDialogTitle mt-1 mb-8 text-xl font-medium focus:outline-none">
						City of Asheville Geographic Information Systems (GIS) Disclaimer
					</AlertDialog.Title>
					<AlertDialog.Description className="AlertDialogDescription">
						The City of Asheville acquires, develops, maintains, and uses GIS data in support of its internal business
						functions and the public services it provides. The GIS data which the City of Asheville distributes and to
						which it provides access may not be suitable for other purposes or uses. All GIS data sets are provided "as
						is" with no warranty. All users should consult public primary information sources, such as recorded deeds
						and plats, to verify the accuracy of the data provided. It is the user's responsibility to verify any
						information derived from the GIS data before making any decisions or taking any action based on the
						information. Use of all GIS data and map services provided by the City of Asheville are covered by this
						disclaimer.
					</AlertDialog.Description>
					<div className="flex gap-6 justify-end">
						<AlertDialog.Action asChild>
							<button autoFocus onClick={handleAccept} className="btn btn-primary">
								Accept
							</button>
						</AlertDialog.Action>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}

export default Disclaimer;
