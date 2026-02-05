export default function ItemsPerPage({ pageSize, setPageSize }) {
	return (
		<div className="">
			<select
				class="btn"
				value={pageSize}
				onChange={(e) => {
					setPageSize(Number(e.target.value));
				}}
			>
				{/* {console.log(pageSize)} */}
				{[10, 20, 30, 40, 50].map((pageSize) => (
					<option key={pageSize} value={pageSize}>
						Show {pageSize}
					</option>
				))}
			</select>
		</div>
	);
}
