function RiskOverview({ title, icon, overview, actions, riskLevel, externalLink }) {
	const anchorId = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	let indicatorColor;
	if (riskLevel === "high") {
		indicatorColor = "#bd2304";
	} else if (riskLevel === "medium") {
		indicatorColor = "orange";
	} else if (riskLevel === "low") {
		indicatorColor = "#4077a5";
	}
	return (
		<section id={anchorId} className="flex h-full mb-8 shadow">
			<div className="flex align-middle border rounded">
				<div className="min-h-full pl-1 rounded-l" style={{ backgroundColor: indicatorColor }}></div>
				<div className="flex items-center">
					<div className="hidden sm:block p-4 flex-shrink-0">
						<img src={icon} className="w-[120px] h-auto" aria-hidden="true" alt="" />
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 p-4 gap-4">
						<div className="">
							<h4 className="text-2xl text-coa-blue-medium mb-2">{title} Risk</h4>
							<div className="space-y-4" dangerouslySetInnerHTML={{ __html: overview }} />
						</div>
						<div>
							<h4 className="text-2xl text-coa-blue-medium mb-2">Action Strategies</h4>
							<ul className="">
								{actions.map((action, index) => {
									return (
										<li key={index} className="mb-4">
											<span className="px-2 block border-l-2 border-coa-blue-light">{action}</span>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default RiskOverview;
