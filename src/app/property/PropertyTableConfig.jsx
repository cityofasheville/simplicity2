import { Link } from "react-router-dom";

export const assetTableConfig = {
	columns: [
		{
			accessorKey: "asset_name",
			cell: ({ row }) => (
				<Link
					to={{
						pathname: "/assets/" + `${row.original.asset_id}`,
						state: { data: row },
					}}
				>
					<span className="hover:underline">{row.original.asset_name}</span>
				</Link>
			),

			header: () => <span>Asset Name</span>,
			footer: (props) => props.column.id,
			size: 350,
		},
		{
			accessorKey: "asset_type_name",
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
			header: () => <span>Asset Type</span>,
			footer: (props) => props.column.id,
			size: 150,
		},
		{
			accessorKey: "tag_list",
			enableColumnFilter: true,
			cell: (info) => {
				let tagList = info.getValue();
				return (
					<div className="h6">
						{tagList.split(", ").map((tag) => {
							return <span className="badge badge-info font-weight-normal mr-2">{tag}</span>;
						})}
					</div>
				);
			},
			header: () => <span>Tags</span>,
			footer: (props) => props.column.id,
			size: 240,
		},
		{
			accessorKey: "owner_name",
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
			header: () => <span>Owner</span>,
			footer: (props) => props.column.id,
			size: 150,
		},
		{
			accessorKey: "description",
			cell: (info) => info.getValue(),
			header: () => <span>Description</span>,
			footer: (props) => props.column.id,
			size: 250,
		},
		// {
		//   accessorKey: 'asset_id',
		//   size: 50,
		//   cell: ({ row }) => (
		//     <div className="w-100 text-center">
		//       <Link
		//         to={{
		//           pathname: '/assets/' + `${row.original.asset_id}/delete`,
		//           state: { data: row, refresh: true },
		//         }}
		//         className=" no-decoration mx-2"
		//         title="Delete this Asset"
		//       >
		//         <span className="fa fa-trash text-danger" aria-hidden="true"></span>
		//       </Link>
		//     </div>
		//   ),
		//   header: () => <div className="w-100 text-center">Action</div>,
		//   footer: (props) => props.column.id,
		// },
		// {
		//   accessorKey: 'owner_id',
		//   cell: (info) => info.getValue(),
		//   header: () => <span>Owner Email</span>,
		//   footer: (props) => props.column.id,
		// },
		// {
		//   accessorKey: 'parents',
		//   cell: (info) => info.getValue(),
		//   header: () => <span>Parents</span>,
		//   footer: (props) => props.column.id,
		// },
		// {
		//   accessorKey: 'location.connection',
		//   cell: (info) => info.getValue(),
		//   header: () => <span>Connection</span>,
		//   footer: (props) => props.column.id,
		// },
		// {
		//   accessorKey: 'etl_active',
		//   cell: (info) => info.getValue(),
		//   header: () => <span>ETL Active</span>,
		//   footer: (props) => props.column.id,
		// },
	],
	navigationRender: {
		paginationButtonsRender: true,
		goToPageRender: true,
		itemsPerPageRender: true,
		itemsPerPage: 20,
	},
	filterRender: {
		globalFilterRender: true,
	},
};
