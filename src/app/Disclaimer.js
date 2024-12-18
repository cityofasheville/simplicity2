import React from 'react';
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import '../styles/components/disclaimer.scss';
import { useState } from 'react';


function Disclaimer({ onAccept }) {
	const [isOpen, setIsOpen] = useState(true);  // To control the modal visibility

	const handleAccept = () => {
		setIsOpen(false); // Close the modal when "Accept" is clicked
		onAccept(); // Trigger the parent function (if necessary)
	  };

	return (
		<AlertDialog.Root open={isOpen} defaultOpen={true}>
		<AlertDialog.Portal>
			<AlertDialog.Overlay className="AlertDialogOverlay" />
			<AlertDialog.Content className="AlertDialogContent">
				<AlertDialog.Title className="AlertDialogTitle">
				City of Asheville Geographic Information Systems (GIS) Disclaimer
				</AlertDialog.Title>
				<AlertDialog.Description className="AlertDialogDescription">
				The City of Asheville acquires, develops, maintains, and uses GIS data in support of its internal business functions and the public services it provides.  
				The GIS data which the City of Asheville distributes and to which it provides access may not be suitable for other purposes or uses.  
				All GIS data sets are provided "as is" with no warranty. 
				All users should consult public primary information sources, such as recorded deeds and plats, to verify the accuracy of the data provided. 
				It is the user's responsibility to verify any information derived from the GIS data before making any decisions or taking any action based on the information.  
				Use of all GIS data and map services provided by the City of Asheville are covered by this disclaimer.
				</AlertDialog.Description>
				<div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
					<AlertDialog.Action asChild>
						<button onClick={handleAccept} className="btn btn-primary">Accept</button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>

	);
};

export default Disclaimer;
