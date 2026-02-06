export default function GoToPage({ gotoPage, pageIndex, pageCount }) {
	const dropdownOptions = Array.from({ length: pageCount }, (_, index) => index + 1);

	return (
		<div className="flex items-baseline">
			Go to page{" "}
			<select
				className="btn ml-2"
				value={pageIndex + 1}
				onChange={(e) => {
					gotoPage(Number(e.target.value) - 1);
				}}
			>
				{dropdownOptions.map((value) => (
					<option key={value} value={value}>
						{value}
					</option>
				))}
			</select>
		</div>
	);
}
