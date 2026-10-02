function AccordionGroup({ children, className = "" }) {
	return <div className={`flex flex-col ${className}`}>{children}</div>;
}

function AccordionItem({ title, children, name, defaultOpen = false }) {
	return (
		<details name={name} open={defaultOpen} className="rounded mb-4 bg-light border border-gray-300">
			<summary className="list-none flex align-middle justify-between py-2 px-5 cursor-pointer items-center">
				<span className="mr-4 text-coa-blue-dark text-xl font-normal" justify-self-start>
					{title}
				</span>
				<span className="bi bi-chevron-down justify-self-end text-xl" aria-hidden="true"></span>
			</summary>
			<div className="entry-content py-4 px-5 border-t bg-white">{children}</div>{" "}
		</details>
	);
}

export { AccordionGroup, AccordionItem };
