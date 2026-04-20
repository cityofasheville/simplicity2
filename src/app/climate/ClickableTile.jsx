import { link } from "d3-shape";
import React from "react";

function ClickableTile({ image, url, text }) {
	const tileRef = React.useRef();
	const linkRef = React.useRef();

	function handleClick(e) {
		if (e.button === 0) {
			if (!e.target.matches(".card-link-action")) {
				linkRef.current.click();
			}
		}
	}

	return (
		<div className="clickable-tile" ref={tileRef} style={{ cursor: "pointer" }} onClick={handleClick}>
			<div className="w-full relative overflow-hidden pb-[100%]">
				<img alt="" src={image} width="auto" height="100%" className="absolute min-h-full" />
				<a ref={linkRef} href={url} className="tile-link-action" target="_blank">
					<span className="flex items-center justify-center text-center absolute w-full h-16 p-4 bg-white bg-opacity-85 bottom-0 font-normal text-coa-blue-dark text-md">
						{text}
					</span>
				</a>
			</div>
		</div>
	);
}

export default ClickableTile;
