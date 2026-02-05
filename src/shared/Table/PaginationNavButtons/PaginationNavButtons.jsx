import React from "react";
import ResponsivePagination from "react-responsive-pagination";
// const { useState, useEffect } = wp.element;
import "react-responsive-pagination/themes/minimal.css";
import "./styles.css";

export default function PaginatioNavButtons({ pageCount, gotoPage, pageIndex }) {
	// console.log(`tha variables ${pageCount}, ${pageIndex}, ${gotoPage}`);
	// page in "handlePageChange" is indexed from 1
	// our tanstack props are indexed from 0
	// so gotoPage has to be -1 to navigate correctly,
	// and current has to be pageIndex + 1 in order to display correctly
	return (
		<div className="flex my-4">
			<ResponsivePagination total={pageCount} current={pageIndex + 1} onPageChange={(page) => gotoPage(page - 1)} />
			{/* {console.log(`Nav page index is ${pageIndex}`)} */}
		</div>
	);
}
